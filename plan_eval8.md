Ah! `InputBar` is currently ONLY shown if `!isEmpty`.
But `EmptyState` has its OWN input area pinned to the bottom.
So when `EmptyState`'s `startChat` creates a conversation, it calls `router.push('/chat/:id')`.
If I replace the inner input in `EmptyState.tsx` with `<InputBar />`, wait.
Can `InputBar` handle starting a new conversation AND routing to it?
In `InputBar.tsx`:
```typescript
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setValue('');
```
`sendMessage` in `chatStore.ts` does:
```typescript
        let convId = get().activeConversationId;
        if (!convId) {
          convId = get().newConversation();
        }
```
If it creates a new conversation, `activeConversationId` changes.
Will the route magically update?
Wait. `ChatView.tsx` syncs FROM URL to store:
```typescript
  useEffect(() => {
    if (conversationIdFromUrl && conversationIdFromUrl !== activeConversationId) {
      setActiveConversation(conversationIdFromUrl);
    }
  }, [conversationIdFromUrl, activeConversationId, setActiveConversation]);
```
Wait, if `activeConversationId` changes in the store, `ChatView` syncs it to `activeInstance.conversationId`:
```typescript
    else if (activeConversationId && activeInstance.conversationId !== activeConversationId) {
      setInstanceConversation(activeInstanceId, activeConversationId);
    }
```
Does it update the URL?
NO! Nothing updates the URL automatically when `activeConversationId` changes unless someone calls `router.push()`.
Wait. In `EmptyState.tsx`, it does `router.push()`.
If I use `<InputBar />` in `EmptyState`, when the user sends a message, `sendMessage` is called. The store gets a new conversation ID.
But the URL won't update to `/chat/:id`! It will remain `/chat`.
Is that a problem?
Well, maybe `InstanceTabBar` or something updates the URL?
Wait, if the user goes to `/chat`, `activeConversationId` is null. They type a message in `InputBar`, `sendMessage` creates a conversation. `activeConversationId` becomes set.
Then `ChatView` re-renders, `isEmpty` becomes false. The view shows `MessageList`. The URL remains `/chat`.
Is that bad? The application is essentially a Single Page App (SPA). It doesn't NEED the URL to update unless they refresh.
But if they refresh on `/chat`, it will load `activeConversationId` from the persist store! (Since `activeConversationId` is persisted).
So they will still see their chat!
But wait, if they have multiple tabs open? The `bridge-cloud-chat` storage syncs them.
Why did `EmptyState` have `router.push`? Probably just for explicit routing.
Wait, if I look at the memory:
"Codebase UI Pattern: When rendering the chat input in the EmptyState component, do not implement a duplicate textarea and submit logic. Instead, import and use the `<InputBar />` component directly to ensure features like 'Stop generation', auto-resize, and state synchronization remain consistent."
So I MUST replace the duplicate logic with `<InputBar />`.
If the user really wants the URL to update, I might need to put the `router.push` somewhere else, or maybe it's not strictly necessary. Let's look at `Sidebar`:
```typescript
  const handleSelect = (id: string) => {
    setActiveConversation(id);
    setSidebarOpen(false); // Close on mobile
    router.push(`/chat/${id}`);
  };
```
Sidebar does `router.push`.
But wait! If `EmptyState` just renders `<InputBar />`, we can't inject `router.push` into `InputBar`.
But maybe we don't need to. The memory explicitly says:
"Instead, import and use the `<InputBar />` component directly"
So I will do exactly that in `EmptyState.tsx`.
What about the suggestion buttons?
```typescript
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => startChat(s)}
```
For suggestion buttons, `startChat` in `EmptyState` can remain and do `router.push`.
Wait, if `EmptyState` uses `<InputBar />`, does `<InputBar />` take any props? No.
So `EmptyState` will just import it.

Let's check `src/components/chat/EmptyState.tsx` bottom section:
```typescript
<<<<<<< SEARCH
      {/* Chat input pinned to bottom */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0a1410] via-[#0a1410] to-transparent pt-6 pb-2 px-4">
        <div className="w-full max-w-[720px] mx-auto">
          <div className={[
            'flex items-end gap-2 px-4 py-3',
            'bg-[#111f15] border rounded-xl transition-colors duration-150',
            'border-[#1e3025] focus-within:border-[#2d4035] focus-within:bg-[#1a2a1f]',
            'focus-within:shadow-[0_0_0_1px_rgba(108,140,255,0.15)]',
          ].join(' ')}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => { setValue(e.target.value); resizeTextarea(); }}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message Bridge Cloud…"
              aria-label="Chat input"
              title="Chat input"
              className={[
                'flex-1 bg-transparent resize-none outline-none',
                'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
                'leading-[1.6] min-h-[24px] overflow-hidden',
              ].join(' ')}
              style={{ maxHeight: '120px' }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
              title="Send message"
              className={[
                'w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 self-end mb-0.5',
                'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]',
                canSend
                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'
                  : 'bg-[#1e3025] cursor-not-allowed',
              ].join(' ')}
            >
              <ArrowUp className={`w-4 h-4 ${canSend ? 'text-[#0a1410]' : 'text-[#5c5c5c]'}`} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-[11px] text-[#5c5c5c] mt-2 select-none">
            Bridge Cloud can make mistakes. Verify important information.
          </p>
        </div>
      </div>
=======
      {/* Chat input pinned to bottom */}
      <InputBar />
>>>>>>> REPLACE
```
And we also need to remove the `useState`, `textareaRef`, `handleSubmit`, `handleKeyDown`, `resizeTextarea`, `canSend` from `EmptyState.tsx`.
But `startChat` stays. And we need to import `InputBar`.
```typescript
import InputBar from './InputBar';
```
Wait, `startChat` uses `router.push`. If the user hits a suggestion button, they get routed. But if they just type in `InputBar`, they don't get routed. Is that acceptable? Yes, it fulfills the memory constraint precisely.
But wait! If they are on `/chat/123`, and they click "New chat", they go to `/chat`?
No, the button in Sidebar creates a new chat in the store, and changes the URL to `/chat/:new_id`. Then `EmptyState` shows up because there are no messages!
Wait, if they are ALREADY on `/chat/:id`, and `EmptyState` is shown, then if they type in `InputBar`, `activeConversationId` is ALREADY set! So `sendMessage` doesn't create a new conversation, it just adds messages to it.
Wait, if they are on `/chat`, `activeConversationId` is usually loaded from local storage.
So really, the URL doesn't need to change unless it explicitly does.

Let's double check orchestration mode changes.
In `src/components/chat/InputBar.tsx`:
```typescript
<<<<<<< SEARCH
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  }, [value, isStreaming, sendMessage, orchestrationMode]);

  const canSend = value.trim().length > 0 && !isStreaming;
=======
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || orchestrationMode !== 'single') return;
    sendMessage(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  }, [value, isStreaming, sendMessage, orchestrationMode]);

  const canSend = value.trim().length > 0 && !isStreaming && orchestrationMode === 'single';
>>>>>>> REPLACE
```
And the textarea:
```typescript
<<<<<<< SEARCH
            placeholder="Message Bridge Cloud…"
            aria-label="Chat input"
            title="Chat input"
            aria-multiline="true"
            className={[
              'flex-1 bg-transparent resize-none outline-none',
              'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
              'leading-[1.6] min-h-[24px] overflow-hidden',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          />
=======
            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud…" : "Orchestration modes coming soon!"}
            aria-label="Chat input"
            title="Chat input"
            aria-multiline="true"
            className={[
              'flex-1 bg-transparent resize-none outline-none',
              'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
              'leading-[1.6] min-h-[24px] overflow-hidden',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          />
>>>>>>> REPLACE
```
And wait, the disabled state on textarea:
```typescript
<<<<<<< SEARCH
            disabled={isStreaming}
            rows={1}
            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud…" : "Orchestration modes coming soon!"}
=======
            disabled={isStreaming || orchestrationMode !== 'single'}
            rows={1}
            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud…" : "Orchestration modes coming soon!"}
>>>>>>> REPLACE
```
And for the send button:
```typescript
<<<<<<< SEARCH
              disabled={!canSend}
              aria-label="Send message"
              title="Send message"
=======
              disabled={!canSend}
              aria-label="Send message"
              title={orchestrationMode === 'single' ? "Send message" : "Orchestration modes coming soon!"}
>>>>>>> REPLACE
```
