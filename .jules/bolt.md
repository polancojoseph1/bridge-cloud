## 2024-05-24 - Dynamic Import Caching
**Learning:** Optimizing dynamic imports (`await import()`) by caching their promises in interaction-driven cold paths (e.g., executed only once per user message) is a micro-optimization with zero measurable impact compared to network latency. Only apply dynamic import caching strategies in high-frequency hot paths.
**Action:** Do not use dynamic import caching for single-time interactions. Instead, focus on caching in true hot paths.
## 2024-05-24 - TextEncoder Caching
**Learning:** TextEncoder is stateless. Instantiating `new TextEncoder()` inside request handlers (e.g., Next.js API route `POST` handlers) or high-frequency streaming loops causes redundant object creation and garbage collection overhead.
**Action:** Always instantiate stateless objects like `TextEncoder` once at the module scope. Note: `TextDecoder` instances used with `{ stream: true }` are stateful and must be kept per-stream.
