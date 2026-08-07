## 2024-08-07 - Fix IPv6 SSRF Bypass via Zero-Compression
**Vulnerability:** The `isForbiddenHostname` function checked for literal '::1' for IPv6 loopback, allowing bypass via zero-compression ('0::1') or zero-padding ('0000:0000:0000:0000:0000:0000:0000:0001'). `dns.promises.lookup()` also does not normalize resolved IPv6 addresses.
**Learning:** In Node.js environments, standard strict string comparison for IPv6 is insufficient for SSRF protection because of multiple valid string representations of the same address.
**Prevention:** Always explicitly normalize IPv6 addresses before comparing them against blocklists, typically by utilizing `new URL('http://[' + ip + ']').hostname.slice(1, -1)`.
