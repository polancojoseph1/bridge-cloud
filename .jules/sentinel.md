## 2024-08-16 - Prevent SSRF Bypass via IPv6 Zero-Padding
**Vulnerability:** The SSRF check for IPv6 addresses in `isForbiddenHostname` relied on string comparison without normalization, allowing bypass via zero-compression and zero-padding (e.g., `0000:0000:0000:0000:0000:0000:0000:0001` instead of `::1`).
**Learning:** In Node.js, DNS resolution and IP handling do not automatically normalize string representations of IPv6 addresses for custom blocklist checks. Zero-padding can bypass simplistic string matchers.
**Prevention:** Always normalize parsed IPv6 addresses to their standard abbreviated form (e.g., using `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) before performing comparisons against string-based blocklists.
