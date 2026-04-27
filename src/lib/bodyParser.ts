import { NextRequest } from 'next/server';

export async function parseJsonBodyWithLimit(req: NextRequest, limit: number) {
  const contentLength = Number(req.headers.get('content-length') || '0');
  if (contentLength > limit) {
    throw new Error('Request body too large');
  }

  if (!req.body) {
    return {};
  }

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let payload = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    payload += decoder.decode(value, { stream: true });
    if (payload.length > limit) {
      reader.cancel();
      throw new Error('Request body too large');
    }
  }

  return JSON.parse(payload);
}
