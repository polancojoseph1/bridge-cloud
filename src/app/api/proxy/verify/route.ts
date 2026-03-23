import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { url, apiKey } = await req.json();

  if (!url || typeof url !== 'string') {
    return new Response(JSON.stringify({ error: 'url is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const targetUrl = url.replace(/\/$/, '') + '/v1/health';

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: apiKey ? { 'X-API-Key': apiKey } : {},
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.status === 401 || res.status === 403) {
      return new Response(
        JSON.stringify({ status: 'auth_error', error: 'API key rejected by server' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!res.ok) {
      return new Response(
        JSON.stringify({ status: 'offline', error: `Server returned ${res.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({
        status: 'online',
        agentId: data.agent_id,
        botName: data.bot_name,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return new Response(
        JSON.stringify({ status: 'offline', error: 'Connection timed out after 8s' }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ status: 'offline', error: err instanceof Error ? err.message : 'Network error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
