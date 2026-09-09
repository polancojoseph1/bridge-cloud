Wait, in my `test_scroll.py` which did `page.mouse.wheel(0, -1000)`:
Did `isProgrammaticScrollRef.current` get set to false by `onWheel`?
Yes, `onWheel` clears it, then `handleScroll` sees `isProgrammaticScrollRef` is false, and calculates `distanceToBottom > 30`, setting `isUserScrolledRef.current = true`.
So scrolling via wheel works.
But wait! What if the user scrolls using touch? `onTouchMove` works.
What if the user clicks and drags the scrollbar?
There is no `onMouseDown` or `onMouseUp` event handler for the scrollbar! So `isProgrammaticScrollRef` remains true (since streaming resets it to 150ms), and `handleScroll` returns! So `isUserScrolledRef` never becomes true if they drag the scroll bar during streaming!

Wait, also:
```typescript
    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
```
If we fix the programmatic scroll tracking, we can just do:
```typescript
    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const targetScrollTop = scrollHeight - clientHeight;

        // If we're at the bottom, we're not scrolled up
        if (targetScrollTop - scrollTop <= 30) {
            isUserScrolledRef.current = false;
        } else {
            // Only set to true if it wasn't a programmatic scroll
            if (!isProgrammaticScrollRef.current) {
                isUserScrolledRef.current = true;
            }
        }
    }
```
Actually, a better way to handle programmatic scroll is to just check if the `scrollTop` exactly matches what we just set it to. If it doesn't, it was a user scroll.
Also, we shouldn't have `isProgrammaticScrollRef` as a boolean, we can have `expectedScrollTopRef` holding the value we programmatically scrolled to.
If `scrollTop` in `onScroll` matches `expectedScrollTopRef` (within 1px), we ignore it!
If it doesn't match, it was a user scroll, and we evaluate `isUserScrolledRef`.

Let's look at `MessageList.tsx`:
```typescript
        const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1) {
            // ...
```
We can just record `expectedScrollTopRef.current = targetScrollTop;`.
In `handleScroll`:
```typescript
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (expectedScrollTopRef.current !== null && Math.abs(scrollTop - expectedScrollTopRef.current) <= 1) {
      // This was our programmatic scroll
      expectedScrollTopRef.current = null; // Consume it
      return;
    }

    // User scrolled
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
```
Wait, smooth scrolling (`scroll-behavior: smooth`) might emit many scroll events with intermediate values.
Does this app use `scroll-behavior: smooth`?
Wait, `scrollRef.current.scrollTop = targetScrollTop;`
If `scroll-behavior: smooth` is set on the container, `scrollTop` will animate, firing many events.
Let's check if `scroll-behavior: smooth` is in the CSS.
In `MessageList.tsx`:
```tsx
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto py-6"
    >
```
No `scroll-smooth` class here. Unless it's in global CSS, it's instant. Wait, `150ms covers most smooth scroll animations` suggests there might be smooth scrolling?
But actually, instant scrolling is the default for `scrollTop = ...`.

Also, what if we use the same fix as standard chats:
Instead of trying to catch every user scroll reliably via scroll events, what if we just listen to `onWheel` and `onTouchStart` and `onMouseDown` on the scrollbar?
Or we can use the `IntersectionObserver` on an element at the bottom.
Actually, the current code works perfectly except maybe for scrollbar dragging?
Is there a simpler bug?
"Auto-scroll should stick to bottom on new messages but stop if user scrolls up"
Let's re-read the issue. "Auto-scroll should stick to bottom on new messages but stop if user scrolls up".
Wait, what if a *new message* from the assistant arrives? The `useEffect` says:
```typescript
  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
        ...
```
Ah! If the user scrolls up, `isUserScrolledRef.current = true`.
But when a NEW message arrives (i.e. `messages.length` increases), we have:
```typescript
    if (messages.length > prevCountRef.current) {
      // The store currently appends BOTH user and assistant messages at the same time,
      // so `lastMsg` is the assistant message. We need to check if the user just sent a message.
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
```
If a new message is sent by the *user*, it forces scroll to bottom. But what if a new message arrives from the *assistant* later? (e.g. orchestration modes, or slow network where assistant message appears after user message?).
Wait, the store appends BOTH at the same time:
```typescript
            messages: [...conv.messages, userMsg, assistantMsg],
```
So `justAddedUserMsg` is ALWAYS true when a new message is added! Because `messages[messages.length - 2]?.role === 'user'` will match the user message that was just added!
So it ALWAYS resets `isUserScrolledRef.current = false` when a new message (user+assistant pair) is added. Which is correct: "Auto-scroll should stick to bottom on new messages".

Wait, but what if the user scrolls up, and then the assistant is STREAMING?
While streaming, `isUserScrolledRef` is true, so it does NOT scroll down. That is correct.
So what's the bug? Let me check how `isUserScrolledRef` behaves when it's just a single streaming message.
Wait, if the user scrolls up during streaming, does it stop auto-scrolling?
My `test_scroll.py` video/screenshot might show it.
Let's see if we can check my `scroll.png` and `scroll3.png` from my local runs.
