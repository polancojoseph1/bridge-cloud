import { NextRequest } from 'next/server';
import { checkHealth } from '@/lib/healthCheck';

export async function POST(req: NextRequest) {
  const { url, apiKey } = await req.json();

  if (!url || typeof url !== 'string') {
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
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid server URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await checkHealth(url, apiKey ?? '');
  return new Response(JSON.stringify(result), {
    status: result.status === 'online' ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
}
