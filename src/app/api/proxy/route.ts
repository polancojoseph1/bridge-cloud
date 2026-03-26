import { NextRequest } from 'next/server';
import { isForbiddenHostname } from '@/lib/ssrf';

// Env var config (Jefe's cloud bots — Option A)
const CLOUD_CONFIGS: Record<string, { url: string; key: string }> = {
  claude: { url: process.env.BRIDGEBOT_CLAUDE_URL ?? '', key: process.env.BRIDGEBOT_CLAUDE_KEY ?? '' },
  gemini: { url: process.env.BRIDGEBOT_GEMINI_URL ?? '', key: process.env.BRIDGEBOT_GEMINI_KEY ?? '' },
  codex:  { url: process.env.BRIDGEBOT_CODEX_URL  ?? '', key: process.env.BRIDGEBOT_CODEX_KEY  ?? '' },
  qwen:   { url: process.env.BRIDGEBOT_QWEN_URL   ?? '', key: process.env.BRIDGEBOT_QWEN_KEY   ?? '' },
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { agentId, message, conversationId, serverUrl, serverKey } = body;

  let targetUrl = '';
  let targetKey = '';

  // Option A: env-configured cloud bots take precedence
  if (agentId === 'free') {
    targetUrl = process.env.BRIDGEBOT_FREE_URL || 'https://openrouter.ai/api';
    // If the URL is explicitly openrouter, and no FREE_KEY is set, fallback to OPENROUTER_API_KEY
    if (targetUrl.includes('openrouter.ai') && !process.env.BRIDGEBOT_FREE_KEY) {
       targetKey = process.env.OPENROUTER_API_KEY || '';
    } else {
       targetKey = process.env.BRIDGEBOT_FREE_KEY || '';
       // Fallback for missing local freebot if we are going to fail anyway
       if (!process.env.BRIDGEBOT_FREE_URL && !process.env.BRIDGEBOT_FREE_KEY) {
           targetKey = process.env.OPENROUTER_API_KEY || '';
       }
    }
  } else {
    const cloud = CLOUD_CONFIGS[agentId as string];
    targetUrl = (cloud?.url) || serverUrl;
    targetKey = (cloud?.key) || serverKey;
  }

  // Since .env.local NOW explicitly defines BRIDGEBOT_FREE_URL=http://localhost:8590
  // and BRIDGEBOT_FREE_KEY=...
  // It will try to hit localhost:8590 and fail (503).
  // Let's implement an explicit fallback: if agentId is 'free', and we catch a network error
  // fetching from BRIDGEBOT_FREE_URL, we retry with OpenRouter.

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'No server configured for this agent' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!targetKey || typeof targetKey !== 'string' || targetKey.trim() === '') {
    return new Response(
      JSON.stringify({ error: 'API key is required for secure connection' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate URL protocol to prevent SSRF
  try {
    const parsedUrl = new URL(targetUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }

    const hn = parsedUrl.hostname.toLowerCase();

    // In test environment we need to bypass localhost restrictions for integration tests,
    // but we also want to test this very logic. We'll allow localhost ONLY if the port
    // is the specific integration test bridgebot port (8585)
    const isIntegrationTestServer = process.env.NODE_ENV === 'test' && hn === 'localhost' && parsedUrl.port === '8585';

    if (!isIntegrationTestServer && isForbiddenHostname(hn)) {
      throw new Error('Forbidden internal hostname or IP');
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Invalid server URL' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let upstream: Response | null = null;
  let isOpenRouter = targetUrl.includes('openrouter.ai');

  const fetchUpstream = async (url: string, key: string, isOR: boolean) => {
    const endpoint = isOR ? `${url}/v1/chat/completions` : `${url}/v1/chat`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (isOR) {
      headers['Authorization'] = `Bearer ${key}`;
      headers['HTTP-Referer'] = 'http://localhost:3000';
      headers['X-Title'] = 'Bridge Cloud';
    } else {
      headers['X-API-Key'] = key;
    }
    const upstreamBody = isOR ? {
      model: 'openrouter/free',
      messages: [{ role: 'user', content: message }],
      stream: true,
    } : {
      message,
      conversation_id: conversationId,
      stream: true,
      instance_id: 0,
      system_prompt: '',
    };
    return await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(upstreamBody),
      signal: req.signal,
    });
  };

  try {
    upstream = await fetchUpstream(targetUrl, targetKey, isOpenRouter);
  } catch {
    // If primary fails and it's the free bot, fallback to openrouter
    if (agentId === 'free' && !isOpenRouter && process.env.OPENROUTER_API_KEY) {
        try {
            isOpenRouter = true;
            upstream = await fetchUpstream('https://openrouter.ai/api', process.env.OPENROUTER_API_KEY, true);
        } catch {
            return new Response(
              JSON.stringify({ error: 'Could not reach bot server or fallback' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } else {
        return new Response(
          JSON.stringify({ error: 'Could not reach bot server' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
  }

  if (!upstream || !upstream.ok) {
     if (agentId === 'free' && !isOpenRouter && process.env.OPENROUTER_API_KEY) {
        try {
            isOpenRouter = true;
            upstream = await fetchUpstream('https://openrouter.ai/api', process.env.OPENROUTER_API_KEY, true);
        } catch {
            return new Response(
              JSON.stringify({ error: 'Could not reach bot server or fallback' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
        }
     }
  }

  if (!upstream || !upstream.ok) {
    // 🛡️ Sentinel: Prevent information disclosure by sanitizing upstream errors
    return new Response(
      JSON.stringify({ error: 'Upstream service returned an error' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (isOpenRouter) {
    return new Response(upstream.body?.pipeThrough(createSSEToNDJSONTransform()), {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  // Pipe NDJSON stream to browser directly
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}

function createSSEToNDJSONTransform() {
  let buffer = '';
  const decoder = new TextDecoder();
  return new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true });
      buffer += text;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.choices?.[0]?.delta?.content) {
              const ndjsonEvent = {
                type: 'delta',
                text: data.choices[0].delta.content,
              };
              controller.enqueue(new TextEncoder().encode(JSON.stringify(ndjsonEvent) + '\n'));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    },
    flush(controller) {
      if (buffer.trim().startsWith('data: ') && buffer.trim() !== 'data: [DONE]') {
        try {
          const data = JSON.parse(buffer.trim().slice(6));
          if (data.choices?.[0]?.delta?.content) {
            const ndjsonEvent = {
              type: 'delta',
              text: data.choices[0].delta.content,
            };
            controller.enqueue(new TextEncoder().encode(JSON.stringify(ndjsonEvent) + '\n'));
          }
        } catch (e) {
            // Ignore
        }
      }
    }
  });
}
