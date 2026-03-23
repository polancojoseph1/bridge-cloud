import { NextRequest } from 'next/server';

// Env var config (Jefe's cloud bots — Option A)
const CLOUD_CONFIGS: Record<string, { url: string; key: string }> = {
  claude: { url: process.env.BRIDGEBOT_CLAUDE_URL ?? '', key: process.env.BRIDGEBOT_CLAUDE_KEY ?? '' },
  gemini: { url: process.env.BRIDGEBOT_GEMINI_URL ?? '', key: process.env.BRIDGEBOT_GEMINI_KEY ?? '' },
  codex:  { url: process.env.BRIDGEBOT_CODEX_URL  ?? '', key: process.env.BRIDGEBOT_CODEX_KEY  ?? '' },
  qwen:   { url: process.env.BRIDGEBOT_QWEN_URL   ?? '', key: process.env.BRIDGEBOT_QWEN_KEY   ?? '' },
  free:   { url: process.env.BRIDGEBOT_FREE_URL   ?? '', key: process.env.BRIDGEBOT_FREE_KEY   ?? '' },
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { agentId, message, conversationId, serverUrl, serverKey } = body;

  // Option A: env-configured cloud bots take precedence
  const cloud = CLOUD_CONFIGS[agentId as string];
  const targetUrl = (cloud?.url) || serverUrl;
  const targetKey = (cloud?.key) || serverKey;

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'No server configured for this agent' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate URL protocol to prevent SSRF
  try {
    const parsedUrl = new URL(targetUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid server URL' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${targetUrl}/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': targetKey ?? '',
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        stream: true,
        instance_id: 0,
        system_prompt: '',
      }),
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Could not reach bot server' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!upstream.ok) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Pipe NDJSON stream to browser
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
