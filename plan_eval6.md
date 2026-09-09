Let's formalize the 3 bugs:

Bug 1: Stop button is visual-only
Fix: In `src/store/chatStore.ts`, move `activeAbortController.abort()` to happen BEFORE setting `isStreaming: false`.
Wait, if it's set to false first, does the abort still work?
The memory says: "When cancelling an active operation using an AbortController stored within a Zustand store (e.g., chatStore.ts), ensure abort() is invoked *before* applying any state updates that reset or clear the controller reference to avoid losing the ability to abort."
So inside `stopGeneration`:
```typescript
<<<<<<< SEARCH
        set(s => {
          if (!s.activeConversationId) return { isStreaming: false };
          const convIndex = s.conversations.findIndex(c => c.id === s.activeConversationId);
          if (convIndex === -1) return { isStreaming: false };

          const conv = s.conversations[convIndex];
          if (conv.messages.length === 0) return { isStreaming: false };

          const lastMsgIndex = conv.messages.length - 1;
          const lastMsg = conv.messages[lastMsgIndex];

          if (!lastMsg.isStreaming) return { isStreaming: false };

          const newMessages = [...conv.messages];
          newMessages[lastMsgIndex] = { ...lastMsg, isStreaming: false };

          const newConversations = [...s.conversations];
          newConversations[convIndex] = { ...conv, messages: newMessages };

          return { isStreaming: false, conversations: newConversations };
        });
        if (activeAbortController) {
          activeAbortController.abort(new DOMException('Aborted', 'AbortError'));
        }
=======
        if (activeAbortController) {
          activeAbortController.abort(new DOMException('Aborted', 'AbortError'));
        }
        set(s => {
          if (!s.activeConversationId) return { isStreaming: false };
          const convIndex = s.conversations.findIndex(c => c.id === s.activeConversationId);
          if (convIndex === -1) return { isStreaming: false };

          const conv = s.conversations[convIndex];
          if (conv.messages.length === 0) return { isStreaming: false };

          const lastMsgIndex = conv.messages.length - 1;
          const lastMsg = conv.messages[lastMsgIndex];

          if (!lastMsg.isStreaming) return { isStreaming: false };

          const newMessages = [...conv.messages];
          newMessages[lastMsgIndex] = { ...lastMsg, isStreaming: false };

          const newConversations = [...s.conversations];
          newConversations[convIndex] = { ...conv, messages: newMessages };

          return { isStreaming: false, conversations: newConversations };
        });
>>>>>>> REPLACE
```

Bug 2: Orchestration modes
Fix: Update `src/components/chat/InputBar.tsx` (the main active one) to disable the send button and change the placeholder.
Also update `src/components/chat/EmptyState.tsx` to disable its `textarea` and `button`?
Wait, if `EmptyState.tsx` uses `textarea` and `button`, it should also handle `orchestrationMode`.
Let's see what the memory says:
"When rendering the chat input in the EmptyState component, do not implement a duplicate textarea and submit logic. Instead, import and use the <InputBar /> component directly to ensure features like 'Stop generation', auto-resize, and state synchronization remain consistent."
Oh wow!
So I should just replace the bottom section of `src/components/chat/EmptyState.tsx` with `<InputBar />`!
Let's check `src/components/chat/EmptyState.tsx` again.
