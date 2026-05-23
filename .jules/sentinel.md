## 2024-05-24 - DoS bypass via Chunked Transfer Encoding
**Vulnerability:** The `/api/chat` route relied solely on the `content-length` header and `req.json()` to limit JSON payload sizes, leaving it vulnerable to memory exhaustion DoS attacks via `Transfer-Encoding: chunked`.
**Learning:** Checking the `content-length` header is insufficient for Node/Next.js routes processing streams, as attackers can omit the header and send infinitely large chunked payloads that `req.json()` will buffer entirely into memory.
**Prevention:** Always read request bodies natively using a custom stream parser (e.g., `parseJsonBodyWithLimit(req.body, limit)`) that counts and limits bytes directly during stream reading, independent of headers.
