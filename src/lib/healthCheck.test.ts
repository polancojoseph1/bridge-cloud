import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkHealth } from './healthCheck';

describe('checkHealth', () => {
  const mockUrl = 'http://localhost:3000';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    vi.useFakeTimers();
    // Clear mock fetch before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return online status on success', async () => {
    const mockData = { agent_id: 'agent-123', bot_name: 'TestBot' };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await checkHealth(mockUrl, mockApiKey);

    expect(global.fetch).toHaveBeenCalledWith(`${mockUrl}/v1/health`, expect.objectContaining({
      method: 'GET',
      headers: { 'X-API-Key': mockApiKey },
    }));

    expect(result).toEqual({
      status: 'online',
      agentId: mockData.agent_id,
      botName: mockData.bot_name,
    });
  });

  it('should handle authentication errors (401)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const result = await checkHealth(mockUrl, mockApiKey);

    expect(result).toEqual({
      status: 'auth_error',
      error: 'API key rejected by server',
    });
  });

  it('should handle authentication errors (403)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 403,
    });

    const result = await checkHealth(mockUrl, mockApiKey);

    expect(result).toEqual({
      status: 'auth_error',
      error: 'API key rejected by server',
    });
  });

  it('should handle offline status on general server error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await checkHealth(mockUrl, mockApiKey);

    expect(result).toEqual({
      status: 'offline',
      error: 'Server returned 500',
    });
  });

  it('should handle offline status on timeout (AbortError)', async () => {
    // Mock fetch to simulate it taking too long and being aborted by the controller
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(async (url, options) => {
      // Simulate fetch being aborted when the signal is triggered
      return new Promise((resolve, reject) => {
        if (options?.signal) {
          options.signal.addEventListener('abort', () => reject(abortError));
        }
      });
    });

    // Start checkHealth but do not await it yet
    const healthPromise = checkHealth(mockUrl, mockApiKey);

    // Fast-forward time to trigger the timeout which will call controller.abort()
    vi.advanceTimersByTime(8000);

    const result = await healthPromise;

    expect(result).toEqual({
      status: 'offline',
      error: 'Connection timed out after 8s',
    });
  });

  it('should handle offline status on network error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed to fetch'));

    const result = await checkHealth(mockUrl, mockApiKey);

    expect(result).toEqual({
      status: 'offline',
      error: 'Failed to fetch',
    });
  });

  it('should handle unknown errors gracefully', async () => {
    // Reject with a non-Error object
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce('string error');

    const result = await checkHealth(mockUrl, mockApiKey);

    expect(result).toEqual({
      status: 'offline',
      error: 'Network error',
    });
  });

  it('should not send X-API-Key header if apiKey is empty', async () => {
    const mockData = { agent_id: 'agent-123', bot_name: 'TestBot' };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    await checkHealth(mockUrl, '');

    expect(global.fetch).toHaveBeenCalledWith(`${mockUrl}/v1/health`, expect.objectContaining({
      method: 'GET',
      headers: {},
    }));
  });
});
