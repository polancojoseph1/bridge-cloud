## 2026-06-01 - Optimizing Zustand Stop Generation
**Learning:** In Zustand stores using AbortController, you must pass an explicit DOMException ('Aborted', 'AbortError') to the `abort` call for downstream `catch` blocks to correctly identify and suppress the error without side-effects. Calling `abort()` without arguments causes a generic error which can incorrectly trigger connection failure handlers instead of silent cancellation.
**Action:** Always provide explicit error reasons when manually aborting fetch streams.

## 2026-06-01 - Deterministic Scroll Tracking
**Learning:** Timeout-based programmatic scroll tracking (`isProgrammaticScrollRef` cleared via `setTimeout(..., 150)`) often fails in fast-streaming environments or across varied refresh rates, leading to broken auto-scroll. Relying on the exact `expectedScrollTop` value check `Math.abs(scrollTop - expectedScrollTopRef.current) <= 1` immediately before discarding the programmatic check provides perfect reliability for scroll-to-bottom features.
**Action:** When implementing programmatic scrolling that should distinguish between user input vs automated scroll, track the exact target pixel value instead of using blind timeouts.
