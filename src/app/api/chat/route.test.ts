import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { streamMockResponse } from '@/lib/mockApi';

vi.mock('@/lib/mockApi', () => ({
  streamMockResponse: vi.fn(),
}));

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should stream the response correctly and return valid SSE headers', async () => {
    // Setup mock implementation
    const mockedStreamResponse = vi.mocked(streamMockResponse);
    mockedStreamResponse.mockImplementation(async (message, agentId, onChunk) => {
      onChunk('chunk 1');
      onChunk('chunk 2');
    });

    // Create a mock request
    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello AI', agentId: 'claude' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Call the handler
    const response = await POST(mockRequest);

    // Verify headers
    expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    expect(response.headers.get('Cache-Control')).toBe('no-cache');
    expect(response.headers.get('Connection')).toBe('keep-alive');
    expect(response.body).toBeInstanceOf(ReadableStream);

    // Read the stream
    const reader = response.body?.getReader();
    expect(reader).toBeDefined();

    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
    result += decoder.decode();

    // Verify the stream content
    expect(result).toBe('data: chunk 1\n\ndata: chunk 2\n\ndata: [DONE]\n\n');

    // Verify the mock was called correctly
    expect(mockedStreamResponse).toHaveBeenCalledTimes(1);
    expect(mockedStreamResponse).toHaveBeenCalledWith(
      'Hello AI',
      'claude',
      expect.any(Function)
    );
  });

  it('should handle empty messages and unknown agent IDs gracefully', async () => {
    const mockedStreamResponse = vi.mocked(streamMockResponse);
    mockedStreamResponse.mockImplementation(async (message, agentId, onChunk) => {
      onChunk('test');
    });

    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '', agentId: 'unknown-bot' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(mockRequest);

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    expect(result).toBe('data: test\n\ndata: [DONE]\n\n');
    expect(mockedStreamResponse).toHaveBeenCalledWith(
      '',
      'unknown-bot',
      expect.any(Function)
    );
  });

  it('should propagate errors thrown by streamMockResponse', async () => {
    const mockedStreamResponse = vi.mocked(streamMockResponse);
    const testError = new Error('Mock stream error');
    mockedStreamResponse.mockRejectedValue(testError);

    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Error test', agentId: 'claude' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(mockRequest);
    const reader = response.body?.getReader();

    // We expect the reader's promise to reject when read() is called
    await expect(reader!.read()).rejects.toThrow('Mock stream error');
  });
});
