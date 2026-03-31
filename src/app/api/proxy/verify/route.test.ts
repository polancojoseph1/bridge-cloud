import { vi, describe, it, expect } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { checkHealth } from '@/lib/healthCheck';
import dns from 'dns';
import { promisify } from 'util';

vi.mock('@/lib/healthCheck', () => ({
  checkHealth: vi.fn(),
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' }),
}));

vi.mock('dns', () => {
  return {
    default: {
      lookup: vi.fn((hostname, options, callback) => {
        // Provide mock ip address to prevent tests from failing due to external lookup
        callback(null, [{ address: '8.8.8.8', family: 4 }]);
      })
    }
  };
});

function createMockRequest(body: any): NextRequest {
  return {
    json: async () => body,
    headers: new Headers(),
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
