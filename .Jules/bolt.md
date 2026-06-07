
## 2024-06-07 - TextEncoder/TextDecoder Allocation Overhead
**Learning:** `TextEncoder` and `TextDecoder` (when used without `{ stream: true }`) are stateless objects. Instantiating them dynamically inside high-frequency Next.js API route handlers (`POST`) or data parsing utilities (like `parseJsonBodyWithLimit`) introduces redundant object allocation and garbage collection overhead on every request.
**Action:** Always instantiate `TextEncoder` and non-streaming `TextDecoder` instances once at the module scope level to share the single instance across concurrent API requests.
