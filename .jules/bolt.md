## 2025-02-18 - Module-level Caching for TextEncoder
**Learning:** Instantiating stateless structures like `TextEncoder` repeatedly inside request handlers (e.g., `POST` methods) or streaming callbacks imposes unnecessary object creation and garbage collection pressure in Node.js server environments.
**Action:** Always extract stateless singletons like `TextEncoder` to the module level when used in high-frequency hot paths such as Next.js API routes or streaming loops.
