Wait, in `scroll2.png` and `scroll3.png`, I can see that `scroll3.png` has a different size than `scroll2.png`. It means it scrolled!
Ah, my code did `scrollTop = 0`, then wait 1 second, then screenshot. If it stayed at `scrollTop = 0`, the screenshot would be identical.
Wait, if it was at `0` in `scroll2.png` and then scrolled down in `scroll3.png`, it means it DID NOT stick to the user's scroll position when streaming! It forced it back down!
Let's verify by just looking at `MessageList.tsx` again.
Why did it force it back down?
If `isProgrammaticScrollRef.current` was true, it ignores the `handleScroll` event!
Wait! The `MessageList.tsx` uses a 150ms timeout.
```typescript
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 150);
```
During streaming, chunks come in very quickly (e.g. 20-50ms).
So `scrollTimeoutRef.current` is continually cleared and reset before it ever fires!
So `isProgrammaticScrollRef.current` remains `true` for the ENTIRE duration of the stream!
So `handleScroll` just does:
```typescript
    if (isProgrammaticScrollRef.current) {
      return;
    }
```
And returns immediately.
So `isUserScrolledRef.current` NEVER becomes true during streaming.
Thus, `!isUserScrolledRef.current` is true, and the next chunk forces scroll to bottom again!
This means if you scroll up during streaming, it just violently pulls you back to the bottom on the next chunk.
Exactly as I suspected!

To fix this: we shouldn't use a timeout that keeps resetting and hiding user scrolls.
Instead, we can just use `expectedScrollTopRef` (like I proposed) or just rely on standard wheel/touch events to stop auto-scroll.
Wait, if we use `onWheel={...}` it SHOULD set it to false, right? My `test_scroll.py` used `page.mouse.wheel` and it DID stop auto-scroll!
Wait, but if I used `scrollTop = 0` (simulating dragging the scrollbar), `onWheel` didn't fire, so it jumped back down.
Is the issue just that we need to detect the user scrolling?
Or is there a simpler fix?

What if we just use a small tolerance?
```typescript
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    // If we're at the bottom, reset the user scrolled flag
    if (distanceToBottom <= 30) {
      isUserScrolledRef.current = false;
    } else {
      // If we are NOT at the bottom, how do we know if it was user or programmatic?
      // If we just programmatically scrolled, the scroll event will have distanceToBottom <= 30 (since we scrolled to bottom).
      // If distanceToBottom > 30, it MUST be a user scroll!
      // Because our programmatic scroll ALWAYS scrolls to bottom!
      // So we don't even need isProgrammaticScrollRef!
      isUserScrolledRef.current = true;
    }
```
Wait! Our programmatic scroll ALWAYS sets `scrollTop = scrollHeight - clientHeight`.
So when that programmatic scroll triggers a `scroll` event, `distanceToBottom` will be 0 (or at least `<= 30`).
So if `distanceToBottom > 30`, it can ONLY be because the user scrolled up! Or the window resized, etc. But either way, we are not at the bottom.
Is that true?
Wait! If we programmatically set `scrollTop = targetScrollTop`, but the DOM updates the `scrollHeight` a microsecond *before* the scroll event fires?
No, we update `scrollTop` immediately *after* the DOM updates.
So when the `scroll` event fires, `scrollTop` is at the bottom, so `distanceToBottom` is 0.
So we don't need `isProgrammaticScrollRef` at all!

Let's trace it:
1. Message added. `scrollHeight` increases.
2. React re-renders.
3. `useEffect` runs. `distanceToBottom` is now large (e.g. 50).
4. `useEffect` sets `scrollTop = targetScrollTop`. (Which is `scrollHeight - clientHeight`).
5. Browser fires `scroll` event.
6. `handleScroll` checks `distanceToBottom`. It is 0! (0 <= 30).
7. `isUserScrolledRef` is set to `false`.

What if the user scrolls up?
1. User scrolls up.
2. Browser fires `scroll` event.
3. `handleScroll` checks `distanceToBottom`. It is 100 (> 30).
4. `isUserScrolledRef` is set to `true`.
5. Next message chunk arrives.
6. `useEffect` runs. `!isUserScrolledRef.current` is FALSE.
7. It does NOT programmatically scroll!
8. `scrollHeight` increases.
9. Browser DOES NOT fire `scroll` event (because `scrollTop` didn't change).
10. If user scrolls back down: `distanceToBottom` <= 30. `isUserScrolledRef` becomes `false`.
11. Next chunk arrives. It scrolls programmatically!

This is brilliantly simple and robust. No timeouts, no boolean flags.
Wait, let's test this logic! Let me rewrite `MessageList.tsx` and run a test.
