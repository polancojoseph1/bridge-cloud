## 2026-06-22 - [Fix AbortController type error in mockApi and store]
**Learning:** `AbortController` streams will fail silently or incorrectly when using `DOMException` cross-environmentally, Next.js or node contexts. Standard `Error` with `.name = 'AbortError'` correctly triggers `abort()` listeners.
**Action:** Always use `const err = new Error('Aborted'); err.name = 'AbortError'; controller.abort(err);` when throwing or aborting fetch streams.
