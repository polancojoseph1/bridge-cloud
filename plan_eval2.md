Wait, in `MessageList.tsx` we have:
```typescript
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 150); // 150ms covers most smooth scroll animations
```
Wait, setting `scrollRef.current.scrollTop = targetScrollTop` triggers a `scroll` event.
And in `handleScroll`:
```typescript
    if (isProgrammaticScrollRef.current) {
      return;
    }
```
If we type something that streams, it constantly updates `scrollTop`, triggering `isProgrammaticScrollRef.current = true`. Then the timeout resets it to `false` after 150ms.
BUT, if it streams faster than 150ms, it's constantly resetting the timeout. Thus `isProgrammaticScrollRef.current` is ALWAYS true.
If the user scrolls up with the mouse wheel during streaming, `handleScroll` is called, but it's ignored because `isProgrammaticScrollRef.current` is true!
Ah! So the user's scroll up is completely ignored while streaming!
We need to distinguish between user scroll and programmatic scroll better, or we need to clear `isProgrammaticScrollRef` on actual user interaction (like wheel or touch move).
Wait, we actually have:
```typescript
      onWheel={() => { isProgrammaticScrollRef.current = false; }}
      onTouchMove={() => { isProgrammaticScrollRef.current = false; }}
```
Ah! So it clears `isProgrammaticScrollRef.current` on wheel or touch move!
But what if the user scrolls by dragging the scrollbar? `onWheel` and `onTouchMove` don't catch that. `onScroll` will catch it, but `onScroll` just sees `isProgrammaticScrollRef.current == true` and returns.
Also, when `scrollTop` is set programmatically, does it fire synchronously or asynchronously?
In React, `element.scrollTop = targetScrollTop` fires a synchronous scroll event in some browsers, and asynchronous in others.
If it fires, and we have a 150ms timeout, the user dragging the scroll bar will just have their `handleScroll` ignored for 150ms after every chunk.

Wait, the requirement: "Auto-scroll should stick to bottom on new messages but stop if user scrolls up"
Is it working?
Wait! In `useEffect` for streaming content updates:
```typescript
  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
      const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      // BUT WHAT IF targetScrollTop IS ONLY 1 PIXEL MORE?
      // Math.abs(...) > 1
```
Wait, is the streaming content update causing the issue because the `content` updates are nested inside a string, but the `useEffect` depends on `[messages, isStreaming]`?
Wait! In `chatStore.ts`:
`sendMessage` updates the message content via:
```typescript
            newMessages[msgIndex] = { ...newMessages[msgIndex], content: newMessages[msgIndex].content + chunkToApply };
```
Does `MessageList.tsx` depend on the *content* of the messages?
```typescript
  const conversation = useChatStore(
    useCallback(s => s.conversations.find(c => c.id === conversationId), [conversationId])
  );
  const messages = conversation?.messages ?? [];
```
Yes, `messages` is a new array every time a chunk is flushed. So `useEffect` runs.
But wait! `isProgrammaticScrollRef` handles ignoring the `onScroll`.
What if `isUserScrolledRef.current` is set to `true`, but then the user sends a new message?
```typescript
    if (messages.length > prevCountRef.current) {
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
```
If the user sends a new message, `isUserScrolledRef` becomes false, so it scrolls down.
So what's the issue?
Let's manually test "Auto-scroll should stick to bottom on new messages but stop if user scrolls up" with the scrollbar drag.
