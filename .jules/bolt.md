## 2024-05-23 - Exact deterministic auto-scroll logic
**Learning:** Programmatic scroll can interfere with user auto-scroll, and timeout-based implementations are flaky.
**Action:** Use an expectedScrollTop ref to exactly identify programmatic scrolls and reset them.

## 2024-05-23 - AbortController error throwing
**Learning:** In order to explicitly throw `AbortError` in downstream fetch calls, you must call `.abort(new DOMException('Aborted', 'AbortError'))`.
**Action:** Use `DOMException` when aborting to explicitly indicate the reason to the stream reader.
