## 2025-02-18 - Stateless TextEncoder in Request Handlers
**Learning:** TextEncoder is stateless. Instantiating `new TextEncoder()` inside request handlers (e.g., Next.js API route POST handlers) or high-frequency streaming loops causes redundant object creation and garbage collection overhead.
**Action:** Always instantiate stateless objects like TextEncoder once at the module scope. Note: TextDecoder instances used with `{ stream: true }` are stateful and must be kept per-stream.
