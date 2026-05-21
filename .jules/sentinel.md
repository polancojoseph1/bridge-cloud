## 2024-05-21 - Replace req.json() with parseJsonBodyWithLimit in chat API
**Vulnerability:** The internal `/api/chat` route uses `await req.json()` which is vulnerable to DoS attacks via Chunked Transfer Encoding bypass, where the `content-length` header is bypassed and large amounts of data are processed.
**Learning:** The protection used in `/api/proxy/route.ts` via `parseJsonBodyWithLimit` must be uniformly applied across *all* routes processing JSON payloads, as mandated by the codebase security patterns.
**Prevention:** Always use `parseJsonBodyWithLimit` with a strict limit instead of `req.json()` when consuming request bodies in API routes.
