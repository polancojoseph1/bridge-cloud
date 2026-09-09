Let's double check if there are any gotchas with the `distanceToBottom > 30` logic.
If `distanceToBottom > 30` means `isUserScrolledRef = true`, then any programmatic scroll to bottom will result in `distanceToBottom <= 30`, so `isUserScrolledRef = false`.
What if `isUserScrolledRef` is true, and the user sends a new message?
```typescript
    if (messages.length > prevCountRef.current) {
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
```
`isUserScrolledRef` is forced to `false`. Then `useEffect` programmatically scrolls to bottom. The `scroll` event fires. `distanceToBottom` is 0. `isUserScrolledRef` stays `false`. Perfect!

Wait! Are there ANY programmatic scrolls that DO NOT go to the bottom?
No, the only programmatic scroll is `scrollRef.current.scrollTop = targetScrollTop`, which goes to the bottom.

So I will completely remove `isProgrammaticScrollRef` and `scrollTimeoutRef`.
```typescript
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
  };
```
Then `useEffect` simplifies to:
```typescript
  useEffect(() => {
    // If the user just sent a message, force auto-scroll to bottom
    // regardless of whether they were previously scrolled up
    if (messages.length > prevCountRef.current) {
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
    prevCountRef.current = messages.length;

    if (scrollRef.current && !isUserScrolledRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    }
  }, [messages.length, isStreaming, lastMsg?.role]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    }
  }, [messages, isStreaming]);
```
Wait! What if we are streaming, `isUserScrolledRef` is false, and we programmatically set `scrollTop`. We don't need `Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1`?
Wait, if `scrollTop` is already at `targetScrollTop`, setting it again does nothing and doesn't fire a `scroll` event. So it's safe.
But doing `scrollRef.current.scrollTop = ...` is fine.

Wait, there is one edge case.
If the browser fires the `scroll` event asynchronously, what if the user scrolls up, but there's a pending `scroll` event from a previous programmatic scroll?
No, if the user scrolls up, they change `scrollTop`, so the event will have the new `scrollTop`. The browser coalesces `scroll` events or fires them in order.
Wait, what if the user scrolls up *exactly* 30px? `distanceToBottom` is 30. `<= 30`, so it thinks we are at bottom. 30px is a fine threshold for "stick to bottom".

Let's test this in `test_scroll3.py`.
