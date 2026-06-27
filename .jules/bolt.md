## 2024-05-24 - Hoist stateless objects in API routes
**Learning:** TextEncoder is stateless and instantiating it on every API request adds unnecessary memory allocation and garbage collection overhead in hot paths.
**Action:** Always hoist stateless utility objects like TextEncoder to module scope outside the request handler.
