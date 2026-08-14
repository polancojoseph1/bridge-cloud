## 2024-05-24 - SSRF Bypass via non-normalized IPv6
**Vulnerability:** The SSRF protection `isForbiddenHostname` was vulnerable to bypass using zero-compressed or zero-padded IPv6 addresses (e.g. `0::1`, `0:0:0:0:0:0:0:1`) because it used strict string matching against `::1` without prior normalization.
**Learning:** Node.js's `dns.promises.lookup()` returns IPv6 addresses in potentially non-normalized forms. Simple string checks are insufficient for IP validation.
**Prevention:** Always normalize resolved IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist.
