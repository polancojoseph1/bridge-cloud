## 2023-10-27 - Mitigation of DoS via Chunked Transfer Encoding Bypass
**Vulnerability:** The internal `/api/chat/route.ts` endpoint processed JSON payloads using standard `req.json()`, failing to prevent DoS attacks via Chunked Transfer Encoding bypasses.
**Learning:** Architecture-level mitigations like `parseJsonBodyWithLimit` must be strictly enforced across *all* routes processing JSON payloads, including internal or test routes, not just external-facing proxies.
**Prevention:** Always use `parseJsonBodyWithLimit` rather than standard `req.json()` on streaming endpoints to ensure strict payload size boundaries are respected even against obfuscated chunking attacks.
