## 2026-09-18 - Prevent SSRF IPv6 Bypasses
**Vulnerability:** The SSRF check `isForbiddenHostname` was vulnerable to bypasses using zero-padded IPv6 addresses (e.g. `[0:0:0:0:0:ffff:127.0.0.1]`) and IPv4-compatible IPv6 addresses (`[::127.0.0.1]`).
**Learning:** Naive string matching on IPv6 addresses is insufficient due to multiple valid representations.
**Prevention:** Always normalize IPv6 addresses (e.g., using Node's built-in `URL` class) before applying blocklist checks, and account for IPv4-compatible formats (`::7f00:`).
