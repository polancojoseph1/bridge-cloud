## 2026-09-09 - IPv6 SSRF bypass via zero-compression and zero-padding
**Vulnerability:** The SSRF check for IPv6 addresses used strict string matching, which could be bypassed using zero-padding or zero-compression.
**Learning:** Always normalize IPv6 addresses to their canonical representation before performing validation.
**Prevention:** Use built-in URL parsing (e.g. `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) to automatically parse and normalize the IPv6 address.
