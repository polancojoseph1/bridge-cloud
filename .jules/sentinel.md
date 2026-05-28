## 2024-05-28 - DoS via Chunked Transfer Encoding in JSON Parsing
**Vulnerability:** The `/api/chat` route used `req.json()` instead of `parseJsonBodyWithLimit`, bypassing the Content-Length check for chunked requests.
**Learning:** Architectural security mitigations must be applied uniformly across all routes that process JSON payloads, not just external-facing proxy endpoints.
**Prevention:** Always use custom stream readers like `parseJsonBodyWithLimit` when strict size bounds are required, rather than relying on native `.json()` parsing and `Content-Length` headers which can be spoofed or bypassed.
