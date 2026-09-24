## 2024-05-30 - SSRF Vulnerability in IPv6 Parsing
**Vulnerability:** The SSRF protection in `isForbiddenHostname` failed to normalize IPv6 addresses, allowing bypasses like `0:0:0:0:0:0:0:1` which evaluating to `::1` but don't match strict string comparisons.
**Learning:** String matching on raw IPv6 addresses is unsafe because they can be zero-padded, compressed, or formatted in multiple valid ways (e.g., IPv4-mapped representations).
**Prevention:** Always normalize IP addresses before applying blocklists. Node.js's built-in `URL` class can reliably normalize IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)`.
