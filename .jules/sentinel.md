## 2024-08-10 - Fix SSRF via IPv6 zero-compression bypass
**Vulnerability:** IPv6 addresses like 0::1 or 0000::1 were not recognized by string matching.
**Learning:** In Node.js, dns.promises.lookup() does not normalize IPv6. Using new URL('http://[' + ip + ']').hostname.slice(1, -1) robustly normalizes it.
**Prevention:** Always normalize IPs (both v4 and v6) before applying blocklists.
