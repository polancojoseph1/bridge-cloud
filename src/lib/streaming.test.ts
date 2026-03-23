import { describe, it, expect, vi, beforeEach } from 'vitest';
import { streamFromProxy } from './streaming';

// Mock the server store module
const useServerStore = {
  getState: vi.fn().mockReturnValue({
    activeProfile: vi.fn().mockReturnValue({ url: 'http://test.com', apiKey: 'test-key' })
  })
};

vi.mock('@/store/serverStore', () => {
  return {
    useServerStore
  };
});

describe('streamFromProxy', () => {
  let fetchMock: any;
  let onChunk: any;
  let onProgress: any;

  beforeEach(() => {
    onChunk = vi.fn();
    onProgress = vi.fn();
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    useServerStore.getState.mockReturnValue({
      activeProfile: vi.fn().mockReturnValue({ url: 'http://test.com', apiKey: 'test-key' })
    });
  });

  const createStream = (chunks: string[]) => {
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      }
    });
  };

  it('should handle a successful stream with chunks and progress', async () => {
    const mockStream = createStream([
      '{"type":"progress","text":"Starting..."}\n',
      '{"type":"delta","text":"Hello "}\n',
      '{"type":"delta","text":"world!"}\n',
      '{"type":"done"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    await streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress);

    expect(fetchMock).toHaveBeenCalledWith('/api/proxy', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        agentId: 'agent1',
        message: 'Hello',
        conversationId: 'conv1',
        serverUrl: 'http://test.com',
        serverKey: 'test-key'
      })
    }));

    expect(onProgress).toHaveBeenCalledWith('Starting...');
    expect(onChunk).toHaveBeenCalledWith('Hello ');
    expect(onChunk).toHaveBeenCalledWith('world!');
  });

  it('should throw an error on non-ok response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress))
      .rejects.toThrow('Proxy error: 500');
  });

  it('should throw an error on stream error event', async () => {
    const mockStream = createStream([
      '{"type":"error","message":"Something went wrong"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    await expect(streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress))
      .rejects.toThrow('Something went wrong');
  });

  it('should ignore non-JSON lines', async () => {
    const mockStream = createStream([
      'Not a JSON line\n',
      '{"type":"delta","text":"Valid JSON"}\n',
      '{"type":"done"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    await streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress);

    expect(onChunk).toHaveBeenCalledWith('Valid JSON');
    expect(onChunk).toHaveBeenCalledTimes(1);
  });

  it('should propagate non-SyntaxError during parsing', async () => {
    const mockStream = createStream([
      '{"type":"delta","text": { "bad": "object" }}\n',
      '{"type":"done"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    // onChunk throws a non-SyntaxError (e.g. TypeError or custom error)
    onChunk.mockImplementationOnce(() => {
      throw new Error('Some other error');
    });

    await expect(streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress))
      .rejects.toThrow('Some other error');
  });

  it('should handle progress without onProgress callback', async () => {
    const mockStream = createStream([
      '{"type":"progress","text":"Starting..."}\n',
      '{"type":"done"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    await streamFromProxy('agent1', 'Hello', 'conv1', onChunk, undefined);

    expect(onChunk).not.toHaveBeenCalled();
    expect(onProgress).not.toHaveBeenCalled();
  });

  it('should handle split chunks across multiple reads', async () => {
    const mockStream = createStream([
      '{"type":"delta"',
      ',"text":"Hello"}\n',
      '{"type":"done"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    await streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress);

    expect(onChunk).toHaveBeenCalledWith('Hello');
  });

  it('should ignore empty lines and whitespace', async () => {
    const mockStream = createStream([
      '   \n',
      '\n',
      '{"type":"delta","text":"Hello"}\n',
      '{"type":"done"}\n'
    ]);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: mockStream
    });

    await streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress);

    expect(onChunk).toHaveBeenCalledWith('Hello');
    expect(onChunk).toHaveBeenCalledTimes(1);
  });

  it('should ignore missing body in response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: null,
      status: 200
    });

    await expect(streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress))
      .rejects.toThrow('Proxy error: 200');
  });

  it('should handle missing serverKey and serverUrl if profile is null', async () => {
    useServerStore.getState.mockReturnValue({
      activeProfile: vi.fn().mockReturnValue(null)
    });

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(streamFromProxy('agent1', 'Hello', 'conv1', onChunk, onProgress))
      .rejects.toThrow('Proxy error: 500');

    expect(fetchMock).toHaveBeenCalledWith('/api/proxy', expect.objectContaining({
      body: JSON.stringify({
        agentId: 'agent1',
        message: 'Hello',
        conversationId: 'conv1',
        serverUrl: '',
        serverKey: ''
      })
    }));
  });
});
