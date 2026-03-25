import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatStore } from './chatStore';

// We need to test the scenarios:
// 1. streamMockResponse error
// 2. streamMockResponse AbortError
// 3. streamFromProxy error
// 4. streamFromProxy AbortError
// 5. Successful streaming update functionality

vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config
}));

const mockGetState = vi.fn();
vi.mock('@/store/serverStore', () => ({
  useServerStore: {
    getState: mockGetState
  }
}));

const mockStreamFromProxy = vi.fn();
vi.mock('@/lib/streaming', () => ({
  streamFromProxy: mockStreamFromProxy
}));

const mockStreamMockResponse = vi.fn();
vi.mock('@/lib/mockApi', () => ({
  streamMockResponse: mockStreamMockResponse
}));

describe('chatStore fallback error handling', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [],
      activeConversationId: null,
      activeAgentId: 'claude',
      isStreaming: false,
      isSidebarOpen: false,
    });
    vi.clearAllMocks();
  });

  describe('when using actual server (hasServer = true)', () => {
    beforeEach(() => {
      mockGetState.mockReturnValue({
        activeProfile: () => ({ id: 'local', type: 'bridgebot' }) // Return truthy value for activeProfile()
      });
    });

    it('handles general error during streamFromProxy', async () => {
      mockStreamFromProxy.mockRejectedValueOnce(new Error('Connection failed'));

      const store = useChatStore.getState();
      await store.sendMessage('Hello proxy');

      const updatedStore = useChatStore.getState();
      const conv = updatedStore.conversations[0];
      const assistantMsg = conv.messages.find(m => m.role === 'assistant');

      expect(assistantMsg?.content).toBe('No connection detected.');
      expect(assistantMsg?.errorType).toBe('connection');
      expect(updatedStore.isStreaming).toBe(false);
    });

    it('handles AbortError during streamFromProxy gracefully', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      mockStreamFromProxy.mockRejectedValueOnce(abortError);

      const store = useChatStore.getState();
      await store.sendMessage('Hello proxy abort');

      const updatedStore = useChatStore.getState();
      const conv = updatedStore.conversations[0];
      const assistantMsg = conv.messages.find(m => m.role === 'assistant');

      expect(assistantMsg?.content).toBe('');
      expect(assistantMsg?.errorType).toBeUndefined();
      expect(updatedStore.isStreaming).toBe(false);
    });
  });

  describe('when using mock server (hasServer = false)', () => {
    beforeEach(() => {
      mockGetState.mockReturnValue({
        activeProfile: () => null // Return falsy value for activeProfile()
      });
    });

    it('handles general error during streamMockResponse', async () => {
      mockStreamMockResponse.mockRejectedValueOnce(new Error('Mock failed'));

      const store = useChatStore.getState();
      await store.sendMessage('Hello mock');

      const updatedStore = useChatStore.getState();
      const conv = updatedStore.conversations[0];
      const assistantMsg = conv.messages.find(m => m.role === 'assistant');

      expect(assistantMsg?.content).toBe('No connection detected.');
      expect(assistantMsg?.errorType).toBe('connection');
      expect(updatedStore.isStreaming).toBe(false);
    });

    it('handles AbortError during streamMockResponse gracefully', async () => {
      const abortError = new Error('Aborted mock');
      abortError.name = 'AbortError';
      mockStreamMockResponse.mockRejectedValueOnce(abortError);

      const store = useChatStore.getState();
      await store.sendMessage('Hello mock abort');

      const updatedStore = useChatStore.getState();
      const conv = updatedStore.conversations[0];
      const assistantMsg = conv.messages.find(m => m.role === 'assistant');

      expect(assistantMsg?.content).toBe('');
      expect(assistantMsg?.errorType).toBeUndefined();
      expect(updatedStore.isStreaming).toBe(false);
    });
  });

  it('verifies onChunk callback updates the message content correctly', async () => {
    mockGetState.mockReturnValue({
      activeProfile: () => ({ id: 'local', type: 'bridgebot' })
    });

    // Correcting the mock implementation to match actual `streamFromProxy` signature:
    // async streamFromProxy(agentId, prompt, conversationId, onChunk, onDone, signal)
    mockStreamFromProxy.mockImplementationOnce(async (agentId, content, convId, onChunk, onDone, signal) => {
      onChunk('Hello ');
      onChunk('World');
    });

    const store = useChatStore.getState();
    await store.sendMessage('Trigger chunk');

    const updatedStore = useChatStore.getState();
    const conv = updatedStore.conversations[0];
    const assistantMsg = conv.messages.find(m => m.role === 'assistant');

    expect(assistantMsg?.content).toBe('Hello World');
    expect(assistantMsg?.errorType).toBeUndefined();
    expect(updatedStore.isStreaming).toBe(false);
  });
});
