## 2024-05-24 - IPv6 SSRF Validation Bypass
**Vulnerability:** The SSRF validation logic relied on strict string matching for IPv6 loopback addresses, which can be bypassed using zero-padding or zero-compression.
**Learning:** IPv6 addresses have multiple valid string representations. Attackers can bypass naive string-matching filters.
**Prevention:** Always normalize IP addresses using a robust parser (e.g., Node.js `URL` class) before applying validation rules.
