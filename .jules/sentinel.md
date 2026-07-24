## 2025-03-01 - SSRF Bypass via IPv6 Zero-Padding and Compression
**Vulnerability:** The SSRF protection in `isForbiddenHostname` relied on exact string matching for IPv6 addresses (`cleanHn === '::1'`). This allowed bypasses using valid alternative IPv6 formats (e.g., `0::1`, `0000::1`).
**Learning:** IPv6 addresses have multiple textual representations (zero-compression, zero-padding) that all route to the same IP. String equality is insufficient for validation.
**Prevention:** Always normalize IPv6 addresses using built-in standard URL parsing (e.g., `new URL('http://[' + ip + ']').hostname`) before comparing them against blocklists.
