## 2024-10-27 - SSRF Bypass via Un-normalized IPv6
**Vulnerability:** The SSRF blocklist in `isForbiddenHostname` attempts to block forbidden internal IPv6 addresses (like `::1`) by performing a strict string equality check against the input hostname.
**Learning:** This is vulnerable because IPv6 addresses have multiple valid string representations. Attackers can bypass strict string checks by zero-padding (e.g., `0000:0000:0000:0000:0000:0000:0000:0001`) or omitting zero-compression.
**Prevention:** Always normalize IP addresses to their canonical format before applying blocklist or allowlist checks. In Node.js, `new URL('http://[' + ipv6 + ']').hostname.slice(1, -1)` can be used to securely parse and normalize IPv6 strings.
