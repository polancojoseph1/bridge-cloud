## 2026-06-01 - AbortController DOMException compatibility
**Learning:** `DOMException` is not a standard globally available object in Node.js environments (like Next.js server-side code or tests), which leads to ReferenceErrors when thrown or checked via `instanceof`.
**Action:** Use standard `Error` objects and check properties manually (e.g., `error.name === 'AbortError'`), or guard the `instanceof` check with `typeof DOMException !== 'undefined'`.

## 2026-06-01 - React programmatic scroll interruption
**Learning:** When using a programmatic scroll flag (e.g. `isProgrammaticScrollRef.current = true`) to prevent `onScroll` from capturing auto-scrolling as user scrolling, using a `setTimeout` to reset it is unreliable due to smooth scrolling firing multiple events unpredictably. It can also lock out genuine manual user scrolls.
**Action:** Track the expected scroll position explicitly (`expectedScrollTop.current`), clear the lock directly inside the `onScroll` handler when the target is reached, and additionally clear the lock eagerly in `onWheel`, `onTouchMove`, `onMouseDown`, and `onTouchStart` events so manual interventions win.
