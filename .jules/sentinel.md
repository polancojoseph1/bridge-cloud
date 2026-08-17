## 2023-10-24 - Normalize IPv6 addresses to prevent SSRF bypass
**Vulnerability:** The SSRF check for IPv6 blocklist addresses was performed using direct string matching against input hostnames, allowing bypass via zero-compression and zero-padding (e.g. `0000:0000:0000:0000:0000:0000:0000:0001` or `0::1`).
**Learning:** `dns.promises.lookup()` does not normalize resolved IPv6 addresses, so they must be explicitly normalized before comparison.
**Prevention:** Always normalize IPv6 hostnames and addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them against an SSRF blocklist.
