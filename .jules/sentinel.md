## 2025-03-09 - Fix SSRF via IPv6 zero-compression bypass
**Vulnerability:** Node.js `dns.promises.lookup()` and URL parsing allow bypassing SSRF blocklists via IPv6 zero-compression and padding (e.g., `0::1`, `0000:0000:0000:0000:0000:0000:0000:0001`) because they do not strictly validate normalized IPv6 strings against static blocklists without normalization.
**Learning:** When validating resolved IPs for SSRF protections, strict string equality against blocklists is insufficient. IPv6 addresses must be explicitly normalized before comparison to handle all equivalent representations.
**Prevention:** Explicitly normalize IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist to ensure all representations are handled.
