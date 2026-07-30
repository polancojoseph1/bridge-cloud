## 2024-07-30 - Fix IPv6 SSRF Filter Bypass
**Vulnerability:** The SSRF filter for IPv6 addresses used strict string matching, which attackers can bypass using alternative representations like zero-padding (`0000:0000:0000:0000:0000:0000:0000:0001`) or zero-compression (`0::1`).
**Learning:** Node.js `dns.promises.lookup()` resolves IPs without normalizing them. When validating them against blocklists, they must be manually normalized.
**Prevention:** Always normalize parsed IPs before validation. For IPv6 in Node/Next, `new URL('http://[' + ip + ']').hostname.slice(1, -1)` correctly normalizes the address.
