## 2024-05-15 - IPv6 Normalization SSRF Bypass
**Vulnerability:** Node.js `dns.promises.lookup()` and strict string comparison validation for SSRF fail to normalize IPv6 addresses (e.g., `0000::1` bypasses `::1` check).
**Learning:** IPv6 addresses have multiple valid representations (zero-compression, zero-padding). Validating without normalizing first allows SSRF blocklist bypasses.
**Prevention:** Always normalize resolved IPs or hostnames (e.g., using `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) before comparing them to a blocklist.
