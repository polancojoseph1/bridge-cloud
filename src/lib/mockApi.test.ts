import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { streamMockResponse } from './mockApi';

describe('streamMockResponse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('streams response chunks correctly', async () => {
    // Need to force random to pick the first template which includes the agentName
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const onChunk = vi.fn();
    const promise = streamMockResponse('Hello', 'claude', onChunk);

    // Fast-forward time to allow chunks to be sent
    await vi.runAllTimersAsync();
    await promise;

    expect(onChunk).toHaveBeenCalled();
    const allChunks = onChunk.mock.calls.map(call => call[0]).join('');
    expect(allChunks).toContain('Claude');
    expect(allChunks).toContain('Hello');
  });

  it('uses the correct agent name based on agentId', async () => {
    const agents = [
      { id: 'claude', expectedName: 'Claude' },
      { id: 'gemini', expectedName: 'Gemini' },
      { id: 'codex', expectedName: 'Codex' },
      { id: 'qwen', expectedName: 'Qwen' },
      { id: 'unknown', expectedName: 'Free Bot' },
    ];

    for (const agent of agents) {
      const onChunk = vi.fn();

      // Need to force random to pick the first template which includes the agentName
      vi.spyOn(Math, 'random').mockReturnValueOnce(0.1); // Pick first template

      const promise = streamMockResponse('test', agent.id, onChunk);

      await vi.runAllTimersAsync();
      await promise;

      const allChunks = onChunk.mock.calls.map(call => call[0]).join('');
      expect(allChunks).toContain(agent.expectedName);
    }
  });

  it('aborts when the signal is aborted before starting', async () => {
    const onChunk = vi.fn();
    const controller = new AbortController();
    controller.abort();

    await expect(streamMockResponse('test', 'claude', onChunk, controller.signal))
      .rejects.toThrow('Aborted');

    expect(onChunk).not.toHaveBeenCalled();
  });

  it('aborts during streaming when signal is aborted', async () => {
    const onChunk = vi.fn();
    const controller = new AbortController();

    const promise = streamMockResponse('test', 'claude', onChunk, controller.signal);

    // Fast-forward enough for a few chunks
    await vi.advanceTimersByTimeAsync(50);

    // Catch the rejection so it doesn't leak as an unhandled promise rejection
    const catchPromise = promise.catch(e => {
      expect(e.message).toBe('Aborted');
    });

    controller.abort();

    // Advance remaining timers so the awaited promise resolves/rejects
    await vi.runAllTimersAsync();

    await catchPromise;

    // Some chunks should have been received before abort
    expect(onChunk).toHaveBeenCalled();
  });
});
