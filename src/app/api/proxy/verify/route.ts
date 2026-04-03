import { NextRequest } from 'next/server';
import { isForbiddenHostname } from '@/lib/ssrf';
import dns from 'dns';
import { promisify } from 'util';
import { auth } from '@clerk/nextjs/server';

const lookup = promisify(dns.lookup);

export async function POST(req: NextRequest) {
  // 🛡️ Sentinel: Close unauthenticated open proxy by requiring login
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Authentication required to use proxy' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 🛡️ Sentinel: Mitigate DoS by enforcing a strict total request body size limit
  const contentLength = Number(req.headers.get('content-length') || '0');
  if (contentLength > 10000) {
    return new Response(JSON.stringify({ error: 'Request body too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { url, apiKey } = await req.json();

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return new Response(JSON.stringify({ error: 'url is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return new Response(JSON.stringify({ error: 'API key is required for secure connection' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate URL protocol to prevent SSRF
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }

    // In test environment we need to bypass localhost restrictions for integration tests
    const isIntegrationTestServer = process.env.NODE_ENV === 'test' && parsedUrl.hostname.toLowerCase() === 'localhost' && parsedUrl.port === '8585';

    if (!isIntegrationTestServer) {
      if (isForbiddenHostname(parsedUrl.hostname)) {
        throw new Error('Forbidden internal hostname or IP');
      }

      // DNS lookup to prevent DNS resolution bypass
      const lookupResult = await lookup(parsedUrl.hostname, { all: true });
      for (const result of lookupResult) {
        if (isForbiddenHostname(result.address)) {
          throw new Error('Forbidden internal hostname or IP');
        }
      }
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid or forbidden server URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const endpoint = url.includes('openrouter.ai') ? `${url}/v1/chat/completions` : url;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(url.includes('openrouter.ai') ? { 'Authorization': `Bearer ${apiKey ?? ''}` } : { 'X-API-Key': apiKey ?? '' })
      },
      signal: controller.signal,
      redirect: 'error'
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return new Response(JSON.stringify({ status: 'offline', error: 'Connection timed out after 8s' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ status: 'offline', error: err instanceof Error ? err.message : 'Network error' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 401 || res.status === 403) {
    return new Response(JSON.stringify({ status: 'auth_error', error: 'API key rejected by server' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  if (!res.ok) {
    // 🛡️ Sentinel: Do not leak raw upstream error body to prevent info disclosure
    return new Response(JSON.stringify({ status: 'offline', error: `Server returned ${res.status}` }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return new Response(JSON.stringify({
    status: 'online',
    agentId: data.agent_id,
    botName: data.bot_name,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
