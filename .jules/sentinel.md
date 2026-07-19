## 2026-07-19 - SSRF IPv6 Zero-Compression Bypass
**Vulnerability:** Strict string equality checks for IPv6 addresses in SSRF protections can be bypassed using zero-compression (e.g. `0::1` for `::1`). Node's `dns.lookup` returns unnormalized IPs.
**Learning:** Always normalize IPv6 inputs before comparing against blocklists.
**Prevention:** Use `new URL('http://[' + ip + ']').hostname.slice(1, -1)` to reliably normalize IPv6 addresses.
