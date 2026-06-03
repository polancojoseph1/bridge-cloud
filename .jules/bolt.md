## 2024-06-03 - Hoist stateless TextEncoder/TextDecoder
**Learning:** Instantiating `new TextEncoder()` and `new TextDecoder()` inside request handlers causes redundant object creation overhead. `TextEncoder` is stateless. `TextDecoder` is stateless unless used with `{ stream: true }`.
**Action:** Always instantiate stateless objects like `TextEncoder` and non-streaming `TextDecoder` once at the module scope to reduce memory churn and GC pauses in hot paths.
