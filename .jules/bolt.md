## 2024-05-18 - Fix stop button missing `abort` loop and implement autoscroll fixes
**Learning:** For fetch readers that accept an `AbortSignal`, adding an explicit `abort` event listener to cancel the reader is necessary because the `fetch` body reading `while` loop won't pick up the `abort` signal during long stalls between chunks.
**Action:** Next time, remember to always attach `signal.addEventListener('abort', () => reader.cancel(), { once: true })` before the while loop in custom SSE stream handling.

## 2024-05-18 - Fix autoscroll getting incorrectly disabled
**Learning:** Using `onWheel` and `onTouchMove` to explicitly separate programmatic vs. user scroll behavior prevents `onScroll` side-effects.
**Action:** Use these listeners to clear programmatic scroll tracking state correctly.
