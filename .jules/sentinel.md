
## 2025-02-18 - Fix IPv6 SSRF bypass
**Vulnerability:** The SSRF protection in `isForbiddenHostname` relied on strict string matching for IPv6 addresses. Attackers could bypass this by providing equivalent unnormalized IPv6 addresses like `0::1`, `[0::1]`, or `0:0:0:0:0:0:0:1` to bypass the localhost `::1` check.
**Learning:** In Node.js, `dns.promises.lookup()` and some URL parsers do not automatically normalize IPv6 addresses into their canonical form, so string matching against blocklists will miss equivalent variations like zero-compression and zero-padding.
**Prevention:** Normalize IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist to ensure all equivalent representations are caught.
