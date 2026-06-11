## 2024-06-11 - TextDecoder Concurrency
**Learning:** TextDecoder with `{ stream: true }` is stateful and causes concurrency bugs if hoisted.
**Action:** Hoist only stateless decoders.
