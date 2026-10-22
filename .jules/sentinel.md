## 2024-05-24 - SSRF Bypass via IPv6 Zero-Compression/Padding
**Vulnerability:** The SSRF protection logic used strict string equality (e.g., `cleanHn === '::1'`) to block IPv6 loopback addresses. Attackers could bypass this using equivalent zero-compressed or zero-padded representations like `0000:0000:0000:0000:0000:0000:0000:0001` or `0:0:0:0:0:0:0:1`.
**Learning:** IPv6 addresses have multiple valid string representations. Strict equality checks are insufficient for validation or blocking.
**Prevention:** Use robust parsing or regex logic that accounts for zero-compression, zero-padding, and IPv4-mapped IPv6 formats when validating IP addresses.
