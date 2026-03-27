import { NextRequest } from 'next/server';
import { checkHealth } from '@/lib/healthCheck';
import { isForbiddenHostname } from '@/lib/ssrf';

export async function POST(req: NextRequest) {
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

    if (!isIntegrationTestServer && isForbiddenHostname(parsedUrl.hostname)) {
      throw new Error('Forbidden internal hostname or IP');
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid or forbidden server URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const endpoint = url.includes('openrouter.ai') ? `${url}/v1/chat/completions` : url;
  const result = await checkHealth(endpoint, apiKey ?? '');
  return new Response(JSON.stringify(result), {
    status: result.status === 'online' ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
}
