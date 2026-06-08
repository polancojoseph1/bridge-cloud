## 2024-06-08 - Module-level TextEncoder and TextDecoder
**Learning:** Instantiating `TextEncoder` and `TextDecoder` (when not used with `{ stream: true }`) inside high-frequency functions or route handlers creates redundant object creation and garbage collection overhead.
**Action:** Always instantiate these stateless objects once at the module scope and reuse them.
