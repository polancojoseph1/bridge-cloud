## 2024-05-24 - DoS Attack via Chunked Transfer Encoding Bypass
**Vulnerability:** The internal `/api/chat` route was parsing JSON using `req.json()` after only checking the `content-length` header. This allows for DoS attacks by sending arbitrarily large payloads using chunked transfer encoding (which omits `content-length`).
**Learning:** Architectural security mitigations must be applied uniformly. A security mechanism implemented in the proxy layer (`/api/proxy`) was missed in the internal chat route.
**Prevention:** Always use safe stream reading implementations with strict hard limits (like `parseJsonBodyWithLimit`) when consuming request bodies, and never rely solely on HTTP headers for enforcing payload sizes.
