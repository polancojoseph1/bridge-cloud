## 2026-10-09 - SSRF Bypass via Trailing Dot
**Vulnerability:** The SSRF protection logic in `isForbiddenHostname` failed to account for fully qualified domain names (FQDNs) ending with a trailing dot (e.g., `127.0.0.1.` or `localhost.`).
**Learning:** Node.js's `URL` class preserves trailing dots in the hostname, which bypasses exact-match and split-based IP blocklists if not explicitly handled.
**Prevention:** Always strip trailing dots (e.g., `.replace(/\.$/, '')`) from the parsed hostname before performing SSRF validation.
