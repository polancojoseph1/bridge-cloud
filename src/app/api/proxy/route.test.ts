import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

function createMockRequest(body: Record<string, unknown>) {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('POST /api/proxy', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 503 when no server is configured', async () => {
    const req = createMockRequest({ agentId: 'unknown', serverUrl: '' });
    const response = await POST(req);

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data).toEqual({ error: 'No server configured for this agent' });
  });

  it('returns 503 when fetch throws an error', async () => {
    const req = createMockRequest({
      agentId: 'custom',
      serverUrl: 'http://custom-server.com',
      serverKey: 'custom-key',
      message: 'hello',
      conversationId: 'conv-123'
    });
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const response = await POST(req);

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data).toEqual({ error: 'Could not reach bot server' });

    // Verify fetch was called with correct arguments
    expect(fetchMock).toHaveBeenCalledWith('http://custom-server.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'custom-key',
      },
      body: JSON.stringify({
        message: 'hello',
        conversation_id: 'conv-123',
        stream: true,
        instance_id: 0,
        system_prompt: '',
      }),
    });
  });

  it('sanitizes the error response when upstream is not ok', async () => {
    const req = createMockRequest({ agentId: 'custom', serverUrl: 'http://custom-server.com', serverKey: 'test-key' });

    // Mock response with ok = false, simulating upstream leaking internal data
    const mockUpstreamResponse = new Response(JSON.stringify({ detail: 'Internal DB Error: stacktrace...' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    fetchMock.mockResolvedValueOnce(mockUpstreamResponse);

    const response = await POST(req);

    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data).toEqual({ error: 'Upstream service returned an error' });
  });

  it('returns 400 when attempting to fetch an internal IP', async () => {
    const req = createMockRequest({ agentId: 'custom', serverUrl: 'http://127.0.0.1:3000', serverKey: 'test-key' });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Invalid or forbidden server URL' });
  });

  it('returns a streamed response with correct headers on success', async () => {
    const req = createMockRequest({ agentId: 'custom', serverUrl: 'http://custom-server.com', serverKey: 'test-key' });

    // Mock successful stream response
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('chunk 1'));
        controller.close();
      }
    });

    const mockUpstreamResponse = new Response(mockStream, {
      status: 200,
    });
    fetchMock.mockResolvedValueOnce(mockUpstreamResponse);

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/x-ndjson');
    expect(response.headers.get('Cache-Control')).toBe('no-cache');
    expect(response.headers.get('X-Accel-Buffering')).toBe('no');

    // Verify the body is passed through
    const reader = response.body?.getReader();
    const { value, done } = await reader!.read();
    expect(new TextDecoder().decode(value)).toBe('chunk 1');
    expect(done).toBe(false);
  });
});
