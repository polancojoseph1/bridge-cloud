## 2024-05-24 - SSRF Bypass via IPv6 Zero-Compression
**Vulnerability:** Node.js `dns.promises.lookup()` does not normalize resolved IPv6 addresses, enabling SSRF bypasses via zero-compression (e.g., `0::1`) because the blocklist matched strings directly.
**Learning:** External libraries and DNS lookup tools might not return uniform representations of IPs.
**Prevention:** Explicitly normalize IP addresses before performing string-based blocklist validations.
