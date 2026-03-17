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

  const result = await checkHealth(url, apiKey ?? '');
  return new Response(JSON.stringify(result), {
    status: result.status === 'online' ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
}
