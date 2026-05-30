## 2024-10-24 - TextEncoder Allocation in Hot Paths
**Learning:** TextEncoder is completely stateless. Instantiating `new TextEncoder()` inside request handlers (like Next.js POST handlers) or tight streaming loops causes unnecessary object creation and garbage collection overhead. (Note: TextDecoder used with `{ stream: true }` IS stateful).
**Action:** Always instantiate stateless objects like `TextEncoder` once at the module scope to reuse them across all requests.
