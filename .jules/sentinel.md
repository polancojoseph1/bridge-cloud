## 2024-03-24 - SSRF Bypass via IPv6 Zero-Compression
**Vulnerability:** The `isForbiddenHostname` SSRF protection in `src/lib/ssrf.ts` was vulnerable to bypass using zero-compressed or zero-padded IPv6 loopback addresses (e.g., `0::1`, `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** Basic string matching for IPv6 addresses is fundamentally flawed due to the multiple equivalent representations of IPv6 addresses defined in RFC 5952.
**Prevention:** Always normalize IPv6 addresses before validation. In Node.js environments, `new URL('http://[' + ip + ']').hostname.slice(1, -1)` can be used to safely parse and normalize IPv6 strings into their canonical form for validation against blocklists.
