import { vi, describe, it, expect } from 'vitest';
import { POST } from './route';

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => Promise.resolve({ userId: 'test-user-id' })
}));

function createStreamRequest(body: object, overrideLength?: string) {
  const jsonStr = JSON.stringify(body);
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(jsonStr);

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    }
  });

  const headers = new Map<string, string>();
  headers.set('content-length', overrideLength ?? uint8Array.length.toString());

  return {
    body: stream,
    json: async () => body,
    headers: {
      get: (key: string) => headers.get(key)
    }
  } as any;
}

describe('POST /api/chat', () => {
  it('accepts valid payload', async () => {
    const req = createStreamRequest({ message: 'Hello', agentId: 'test' });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('rejects payload larger than 50000 bytes in stream', async () => {
    // Generate a payload that will be large
    const largeMessage = 'A'.repeat(60000);
    // Pretend content-length is small to bypass the first check
    const req = createStreamRequest({ message: largeMessage, agentId: 'test' }, '100');
    const res = await POST(req);
    expect(res.status).toBe(413);
  });
});
