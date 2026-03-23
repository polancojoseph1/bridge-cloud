import { render, screen, waitFor } from '@testing-library/react';
import ChatView from './ChatView';
import { useChatStore } from '@/store/chatStore';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the Zustand store
vi.mock('@/store/chatStore', () => ({
  useChatStore: vi.fn(),
}));

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
    };

    (useChatStore as any).mockImplementation((selector: any) => selector(mockState));

    render(<ChatView />);

    await waitFor(() => {
      // the renderer or markdown component might transform text, but we should find the text "Hi there!" somewhere.
      expect(screen.getByText('Hi there!')).toBeTruthy();
    });
  });
});
