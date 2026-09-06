## 2026-09-06 - Fix SSRF bypass via unnormalized IPv6
**Vulnerability:** The SSRF protection allowed bypasses using unnormalized IPv6 addresses (e.g. zero-padded or zero-compressed like `0000:0000:0000:0000:0000:0000:0000:0001`) because it used strict string equality against `::1`.
**Learning:** Checking IPv6 addresses as raw strings is fundamentally insecure due to multiple valid representations. They must be normalized before comparison.
**Prevention:** Always normalize IP addresses using built-in parsing logic like Node's `URL` class before applying allowlist/denylist rules.
