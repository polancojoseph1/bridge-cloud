'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatStore, Conversation, Message } from '@/types';
import { AGENTS } from '@/lib/agents';
// streamMockResponse imported dynamically below as fallback

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      activeAgentId: 'claude',
      isStreaming: false,
      isSidebarOpen: false,

      activeConversation: () =>
        get().conversations.find(c => c.id === get().activeConversationId) ?? null,
      activeAgent: () =>
        AGENTS.find(a => a.id === get().activeAgentId) ?? AGENTS[0],

      newConversation: () => {
        const id = generateId();
        const conv: Conversation = {
          id,
          title: 'New conversation',
          agentId: get().activeAgentId,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set(s => ({ conversations: [conv, ...s.conversations], activeConversationId: id }));
        return id;
      },

      setActiveConversation: (id: string) => set({ activeConversationId: id }),

      setActiveAgent: (agentId: string) => set({ activeAgentId: agentId }),

      sendMessage: async (content: string) => {
        if (get().isStreaming) return;
        let convId = get().activeConversationId;
        if (!convId) {
          convId = get().newConversation();
        }
        const userMsg: Message = {
          id: generateId(),
          conversationId: convId,
          role: 'user',
          content,
          agentId: null,
          createdAt: Date.now(),
          isStreaming: false,
        };
        const assistantMsgId = generateId();
        const assistantMsg: Message = {
          id: assistantMsgId,
          conversationId: convId,
          role: 'assistant',
          content: '',
          agentId: get().activeAgentId,
          createdAt: Date.now(),
          isStreaming: true,
        };
        set(s => ({
          isStreaming: true,
          conversations: s.conversations.map(c =>
            c.id === convId
              ? {
                  ...c,
                  title: c.messages.length === 0 ? content.slice(0, 40) : c.title,
                  messages: [...c.messages, userMsg, assistantMsg],
                  updatedAt: Date.now(),
                }
              : c
          ),
        }));
        const agentId = get().activeAgentId;
        const onChunk = (chunk: string) => {
          set(s => ({
            conversations: s.conversations.map(c =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map(m =>
                      m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
                    ),
                  }
                : c
            ),
          }));
        };
        const { useServerStore } = await import('@/store/serverStore');
        const hasServer = useServerStore.getState().activeProfile() !== null;
        if (hasServer) {
          const { streamFromProxy } = await import('@/lib/streaming');
          await streamFromProxy(agentId, content, convId, onChunk);
        } else {
          const { streamMockResponse } = await import('@/lib/mockApi');
          await streamMockResponse(content, agentId, onChunk);
        }
        set(s => ({
          isStreaming: false,
          conversations: s.conversations.map(c =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                  ),
                }
              : c
          ),
        }));
      },

      deleteConversation: (id: string) => {
        const convs = get().conversations.filter(c => c.id !== id);
        const next = convs.length > 0 ? convs[0].id : null;
        set({
          conversations: convs,
          activeConversationId: get().activeConversationId === id ? next : get().activeConversationId,
        });
      },

      clearAll: () => set({ conversations: [], activeConversationId: null }),
      toggleSidebar: () => set(s => ({ isSidebarOpen: !s.isSidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'bridge-cloud-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        activeAgentId: state.activeAgentId,
      }),
    }
  )
);
