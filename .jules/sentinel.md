## 2024-05-24 - IPv6 SSRF Filter Bypass
**Vulnerability:** Strict string comparisons for IPv6 addresses in `isForbiddenHostname` allowed bypasses via zero-padding and zero-compression (e.g., `0000:0000:0000:0000:0000:0000:0000:0001` or `0::1` instead of `::1`).
**Learning:** `dns.promises.lookup()` returns the verbatim resolved string format, which may not be normalized. Relying on simple string matching for SSRF protection is inadequate for complex address formats like IPv6.
**Prevention:** Normalize IPv6 addresses explicitly (e.g. via `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) before comparing them against a blocklist.
