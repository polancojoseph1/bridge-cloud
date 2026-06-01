import { render, screen, waitFor } from '@testing-library/react';
import ChatView from './ChatView';
import { useChatStore } from '@/store/chatStore';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the Zustand store
vi.mock('@/store/chatStore', () => ({
  useChatStore: vi.fn(),
}));
vi.mock('@/store/instanceStore', () => ({
  useInstanceStore: vi.fn(),
}));

import { useInstanceStore } from '@/store/instanceStore';

describe('ChatView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat and gives an output when a message is sent', async () => {
    const mockState = {
      activeConversationId: 'test-conv-1',
      activeConversation: () => ({
        id: 'test-conv-1',
        messages: [
          { id: 'msg-1', role: 'user', content: 'Hello' },
          { id: 'msg-2', role: 'assistant', content: 'Hi there!' }
        ],
      }),
      conversations: [
        {
          id: 'test-conv-1',
          messages: [
            { id: 'msg-1', role: 'user', content: 'Hello' },
            { id: 'msg-2', role: 'assistant', content: 'Hi there!' }
          ],
        }
      ],
      isStreaming: false,
      sendMessage: vi.fn(),
      setActiveConversation: vi.fn(),
      setActiveAgent: vi.fn(),
    };

    const mockInstanceState = {
      activeInstanceId: 'inst-1',
      activeInstance: () => ({ id: 'inst-1', conversationId: 'test-conv-1', agentId: 'agent-1' }),
      instances: [{ instanceId: 'inst-1', id: 'inst-1', conversationId: 'test-conv-1', agentId: 'agent-1' }],
      addInstance: vi.fn(),
      removeInstance: vi.fn(),
      setActiveInstance: vi.fn(),
      setInstanceConversation: vi.fn(),
    };

    (useChatStore as any).mockImplementation((selector: any) => selector(mockState));
    (useInstanceStore as any).mockImplementation((selector: any) => selector(mockInstanceState));

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    render(<ChatView />);

    await waitFor(() => {
      // the renderer or markdown component might transform text, but we should find the text "Hi there!" somewhere.
      expect(screen.getByText('Hi there!')).toBeTruthy();
    });
  });
});
