import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatStore } from './chatStore';

const mockActiveProfile = vi.fn();
vi.mock('@/store/serverStore', () => ({
  useServerStore: {
    getState: () => ({
      activeProfile: mockActiveProfile,
    }),
  },
}));

const mockStreamFromProxy = vi.fn();
vi.mock('@/lib/streaming', () => ({
  streamFromProxy: mockStreamFromProxy,
}));

const mockStreamMockResponse = vi.fn();
vi.mock('@/lib/mockApi', () => ({
  streamMockResponse: mockStreamMockResponse,
}));

describe('chatStore fallback error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.getState().clearAll();
    useChatStore.getState().newConversation();
  });

  it('should handle AbortError gracefully', async () => {
    mockActiveProfile.mockReturnValue(null); // Use mockApi

    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    mockStreamMockResponse.mockRejectedValueOnce(abortError);

    await useChatStore.getState().sendMessage('Hello');

    const activeConv = useChatStore.getState().activeConversation();
    expect(activeConv).not.toBeNull();
    const assistantMsg = activeConv!.messages.find(m => m.role === 'assistant');
    expect(assistantMsg).toBeDefined();
    // It should not have errorType since it was aborted
    expect(assistantMsg!.errorType).toBeUndefined();
    expect(assistantMsg!.content).toBe(''); // No content was added
  });

  it('should handle non-AbortError and set errorType to connection', async () => {
    mockActiveProfile.mockReturnValue({ url: 'http://test', apiKey: 'key' }); // Use proxy

    const networkError = new Error('Network failed');
    mockStreamFromProxy.mockRejectedValueOnce(networkError);

    await useChatStore.getState().sendMessage('Hello');

    const activeConv = useChatStore.getState().activeConversation();
    expect(activeConv).not.toBeNull();
    const assistantMsg = activeConv!.messages.find(m => m.role === 'assistant');
    expect(assistantMsg).toBeDefined();

    expect(assistantMsg!.errorType).toBe('connection');
    expect(assistantMsg!.content).toBe('No connection detected.');
  });

  it('should ignore send if already streaming', async () => {
    useChatStore.setState({ isStreaming: true });
    await useChatStore.getState().sendMessage('test');

    const conv = useChatStore.getState().activeConversation();
    expect(conv!.messages.length).toBe(0); // Should return early and not add messages
  });

  it('should stop generation using stopGeneration', async () => {
    useChatStore.setState({ isStreaming: false });
    mockActiveProfile.mockReturnValue(null);
    let capturedSignal: AbortSignal | undefined;

    mockStreamMockResponse.mockImplementation((content, agentId, onChunk, signal) => {
      capturedSignal = signal;
      return new Promise((resolve) => setTimeout(resolve, 50));
    });

    // Start a message send without awaiting it
    const sendPromise = useChatStore.getState().sendMessage('Hello');

    // Give it a tick to set activeAbortController
    await new Promise(r => setTimeout(r, 10));

    expect(capturedSignal).toBeDefined();
    expect(capturedSignal!.aborted).toBe(false);

    // Call stopGeneration
    useChatStore.getState().stopGeneration();

    expect(capturedSignal!.aborted).toBe(true);

    // Cleanup
    await sendPromise;
  });

  it('should clear null activeAbortController gracefully', async () => {
    // Calling stopGeneration when not streaming/null shouldn't throw
    expect(() => useChatStore.getState().stopGeneration()).not.toThrow();
  });

  it('should call onChunk in streamMockResponse correctly', async () => {
    mockActiveProfile.mockReturnValue(null); // mock api

    mockStreamMockResponse.mockImplementation(async (content, agentId, onChunk, signal) => {
      onChunk('chunk1');
      onChunk('chunk2');
    });

    await useChatStore.getState().sendMessage('Hello');

    const activeConv = useChatStore.getState().activeConversation();
    expect(activeConv).not.toBeNull();
    const assistantMsg = activeConv!.messages.find(m => m.role === 'assistant');
    expect(assistantMsg!.content).toBe('chunk1chunk2');
  });

  it('should trigger onChunk in streamFromProxy correctly', async () => {
    mockActiveProfile.mockReturnValue({ url: 'http://test', apiKey: 'key' }); // Use proxy

    mockStreamFromProxy.mockImplementation(async (agentId, content, convId, onChunk, onProgress, signal) => {
      onChunk('chunk3');
      onChunk('chunk4');
    });

    await useChatStore.getState().sendMessage('Hello server');

    const activeConv = useChatStore.getState().activeConversation();
    expect(activeConv).not.toBeNull();
    const assistantMsg = activeConv!.messages.find(m => m.role === 'assistant');
    expect(assistantMsg!.content).toBe('chunk3chunk4');
  });

  it('should handle toggleSidebar and setSidebarOpen', () => {
    expect(useChatStore.getState().isSidebarOpen).toBe(false);

    useChatStore.getState().toggleSidebar();
    expect(useChatStore.getState().isSidebarOpen).toBe(true);

    useChatStore.getState().setSidebarOpen(false);
    expect(useChatStore.getState().isSidebarOpen).toBe(false);
  });

  it('should set active agent', () => {
    expect(useChatStore.getState().activeAgentId).toBe('claude');

    useChatStore.getState().setActiveAgent('gpt-4');
    expect(useChatStore.getState().activeAgentId).toBe('gpt-4');
  });

  it('should fallback activeAgent correctly when unknown agent set', () => {
    useChatStore.getState().setActiveAgent('unknown-agent');

    const activeAgent = useChatStore.getState().activeAgent();
    // Assuming AGENTS[0] is Claude and it falls back to it
    expect(activeAgent.id).toBe('claude');
  });

  it('should delete conversation', async () => {
    useChatStore.getState().clearAll();
    const id1 = useChatStore.getState().newConversation();
    const id2 = useChatStore.getState().newConversation();

    useChatStore.getState().setActiveConversation(id2);
    expect(useChatStore.getState().activeConversationId).toBe(id2);

    // Delete active conversation, should fallback to id1
    useChatStore.getState().deleteConversation(id2);
    expect(useChatStore.getState().conversations.length).toBe(1);
    expect(useChatStore.getState().activeConversationId).toBe(id1);

    // Delete last conversation, should fallback to null
    useChatStore.getState().deleteConversation(id1);
    expect(useChatStore.getState().conversations.length).toBe(0);
    expect(useChatStore.getState().activeConversationId).toBeNull();
  });

  it('should return null for activeConversation if no match', () => {
    useChatStore.getState().setActiveConversation('not-found');
    expect(useChatStore.getState().activeConversation()).toBeNull();
  });

  it('should set partialized state', () => {
    // A trick to test the partializer. We just create a fresh chat store instances
    // or inspect the internal store directly
    const state = useChatStore.getState();
    const persistOptions = (useChatStore as any)?.persist?.getOptions?.() || {};
    if (persistOptions.partialize) {
        const partialized = persistOptions.partialize(state);
        expect(partialized).toHaveProperty('conversations');
        expect(partialized).toHaveProperty('activeConversationId');
        expect(partialized).toHaveProperty('activeAgentId');
        expect(partialized).not.toHaveProperty('isStreaming');
    }
  });

  it('should create new conversation if no active conversation exists', async () => {
    useChatStore.setState({ isStreaming: false }); // Reset state if needed
    useChatStore.getState().clearAll();

    mockActiveProfile.mockReturnValue(null);
    mockStreamMockResponse.mockResolvedValueOnce(undefined);

    await useChatStore.getState().sendMessage('New message');

    const conv = useChatStore.getState().activeConversation();
    expect(conv).not.toBeNull();
    expect(conv!.messages.length).toBe(2);
  });
});
