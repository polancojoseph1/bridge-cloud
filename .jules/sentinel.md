## 2024-05-24 - DoS bypass via Chunked Transfer Encoding
**Vulnerability:** Relying on `req.json()` after checking `req.headers.get('content-length')` allows attackers to bypass payload limits by omitting the header and using chunked transfer encoding.
**Learning:** The architectural mitigation `parseJsonBodyWithLimit` must be applied uniformly to ALL routes accepting JSON payloads, not just external-facing ones.
**Prevention:** Always use a stream reader with a hard byte limit (like `parseJsonBodyWithLimit`) when parsing incoming request bodies instead of relying on `req.json()` or `req.text()`.
