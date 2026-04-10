'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatStore, Conversation, Message } from '@/types';
import { AGENTS } from '@/lib/agents';
import { generateId } from '@/lib/utils';
// streamMockResponse imported dynamically below as fallback

// AbortController state is kept out of persist
let activeAbortController: AbortController | null = null;

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

      setActiveConversation: (id: string | null) => set({ activeConversationId: id }),

      setActiveAgent: (agentId: string) => set({ activeAgentId: agentId }),

      stopGeneration: () => {
        set({ isStreaming: false });
        if (activeAbortController) {
          activeAbortController.abort();
          // Do not nullify here, let sendMessage cleanup
        }
      },

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
        set(s => {
          // ⚡ Bolt Optimization: Replaced O(N) array mapping with O(N) findIndex and O(1) mutations
          const convIndex = s.conversations.findIndex(c => c.id === convId);
          if (convIndex === -1) return { isStreaming: true };
          const conv = s.conversations[convIndex];

          const newConversations = [...s.conversations];
          newConversations[convIndex] = {
            ...conv,
            title: conv.messages.length === 0 ? content.slice(0, 40) : conv.title,
            messages: [...conv.messages, userMsg, assistantMsg],
            updatedAt: Date.now(),
          };

          return { isStreaming: true, conversations: newConversations };
        });
        const agentId = get().activeAgentId;

        let pendingChunk = '';
        let flushTimeout: NodeJS.Timeout | null = null;

        const flushChunk = () => {
          if (!pendingChunk) return;
          const chunkToApply = pendingChunk;
          pendingChunk = '';

          set(s => {
            // ⚡ Bolt Optimization: Replaced nested O(N*M) array mapping with O(N+M) findIndex and O(1) array copies
            // This massively reduces CPU overhead and GC pauses during high-frequency streaming updates
            const convIndex = s.conversations.findIndex(c => c.id === convId);
            if (convIndex === -1) return s;
            const conv = s.conversations[convIndex];
            const msgIndex = conv.messages.findIndex(m => m.id === assistantMsgId);
            if (msgIndex === -1) return s;

            const newMessages = [...conv.messages];
            newMessages[msgIndex] = { ...newMessages[msgIndex], content: newMessages[msgIndex].content + chunkToApply };

            const newConversations = [...s.conversations];
            newConversations[convIndex] = { ...conv, messages: newMessages };

            return { conversations: newConversations };
          });
        };

        const onChunk = (chunk: string) => {
          pendingChunk += chunk;
          if (!flushTimeout) {
            flushTimeout = setTimeout(() => {
              flushTimeout = null;
              flushChunk();
            }, 16);
          }
        };
        activeAbortController = new AbortController();

        const { useServerStore } = await import('@/store/serverStore');
        const hasServer = useServerStore.getState().activeProfile() !== null;
        try {
          if (hasServer) {
            const { streamFromProxy } = await import('@/lib/streaming');
            await streamFromProxy(agentId, content, convId, onChunk, undefined, activeAbortController.signal);
          } else {
            const { streamMockResponse } = await import('@/lib/mockApi');
            await streamMockResponse(content, agentId, onChunk, activeAbortController.signal);
          }
        } catch (error: unknown) {
          if ((error as any)?.name === 'AbortError' || (error instanceof DOMException && error.name === 'AbortError') || (error as any)?.message === 'Aborted') {
            // User stopped generation, we just end here gracefully
          } else {
            set(s => {
              const convIndex = s.conversations.findIndex(c => c.id === convId);
              if (convIndex === -1) return s;
              const conv = s.conversations[convIndex];
              const msgIndex = conv.messages.findIndex(m => m.id === assistantMsgId);
              if (msgIndex === -1) return s;

              const newMessages = [...conv.messages];
              newMessages[msgIndex] = { ...newMessages[msgIndex], content: 'No connection detected.', errorType: 'connection' as const };

              const newConversations = [...s.conversations];
              newConversations[convIndex] = { ...conv, messages: newMessages };

              return { conversations: newConversations };
            });
          }
        } finally {
          if (flushTimeout) clearTimeout(flushTimeout);
          flushChunk();
          activeAbortController = null;
        }

        set(s => {
          const convIndex = s.conversations.findIndex(c => c.id === convId);
          if (convIndex === -1) return { isStreaming: false };
          const conv = s.conversations[convIndex];
          const msgIndex = conv.messages.findIndex(m => m.id === assistantMsgId);
          if (msgIndex === -1) return { isStreaming: false };

          const newMessages = [...conv.messages];
          newMessages[msgIndex] = { ...newMessages[msgIndex], isStreaming: false };

          const newConversations = [...s.conversations];
          newConversations[convIndex] = { ...conv, messages: newMessages };

          return { isStreaming: false, conversations: newConversations };
        });
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
