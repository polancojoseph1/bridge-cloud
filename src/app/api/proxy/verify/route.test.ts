import { vi, describe, it, expect } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { checkHealth } from '@/lib/healthCheck';

vi.mock('@/lib/healthCheck', () => ({
  checkHealth: vi.fn(),
}));

function createMockRequest(body: any): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('POST /api/proxy/verify', () => {
  it('returns 400 if url is missing', async () => {
    const req = createMockRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('url is required');
  });

  it('returns 400 if url is not a string', async () => {
    const req = createMockRequest({ url: 123 });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('url is required');
  });

  it('returns 200 with online status if health check passes', async () => {
    vi.mocked(checkHealth).mockResolvedValueOnce({
      status: 'online',
      agentId: 'test-agent',
      botName: 'Test Bot',
    });

    const req = createMockRequest({ url: 'http://test.com', apiKey: 'test-key' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('online');
    expect(data.agentId).toBe('test-agent');
    expect(data.botName).toBe('Test Bot');

    expect(checkHealth).toHaveBeenCalledWith('http://test.com', 'test-key');
  });

  it('returns 503 if health check fails or returns offline', async () => {
    vi.mocked(checkHealth).mockResolvedValueOnce({
      status: 'offline',
      error: 'Connection timed out',
    });

    const req = createMockRequest({ url: 'http://test.com', apiKey: 'test-key' }); // apiKey provided
    const res = await POST(req);

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe('offline');
    expect(data.error).toBe('Connection timed out');

    expect(checkHealth).toHaveBeenCalledWith('http://test.com', 'test-key');
  });
});
