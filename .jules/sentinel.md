## 2024-05-18 - SSRF Vulnerability in IPv6 Validation
**Vulnerability:** The `isForbiddenHostname` function used naive string matching to validate IPv6 hostnames, allowing bypasses using zero compression, zero padding, and IPv4-mapped IPv6 formats (e.g. `0::1`, `0000:0000:0000:0000:0000:0000:0000:0001`, `::ffff:127.0.0.1`).
**Learning:** IPv6 addresses have multiple valid string representations. Normalization is required before checking against a blocklist. Node.js `dns.promises.lookup()` returns the resolved IP verbatim without normalization, exacerbating this issue.
**Prevention:** Always normalize IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist to ensure equivalent representations are caught.
