
## 2025-02-12 - SSRF Bypass via IPv6 Formatting
**Vulnerability:** The Server-Side Request Forgery (SSRF) blocklist relied on strict string equality (`cleanHn === '::1'`) to block IPv6 localhost addresses. This could be bypassed using uncompressed or zero-padded IPv6 formats like `0:0:0:0:0:0:0:1` or `0::1`, allowing attackers to query internal services.
**Learning:** IPv6 strings are highly variable in their textual representation. Direct string comparison for security checks on IP addresses is insufficient and dangerous because multiple valid string formats resolve to the same destination.
**Prevention:** Always parse and normalize IP addresses and hostnames using a robust mechanism (like the built-in `URL` constructor's hostname parser) before comparing them against security blocklists.
