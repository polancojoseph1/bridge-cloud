## 2024-05-15 - Fix SSRF bypass via unnormalized IPv6 addresses
**Vulnerability:** The application's SSRF protection blocked forbidden IPv6 hostnames using strict string matches (e.g. `=== '::1'`). This allowed non-canonical addresses (like `0::1` or `0000:0000:0000:0000:0000:0000:0000:0001`) to bypass the blocklist because they evaluate to the same IP but do not match the exact strings in the blocklist.
**Learning:** `dns.promises.lookup` does not normalize resolved IPv6 addresses, nor do direct string inputs, leaving SSRF checks vulnerable to bypass.
**Prevention:** Explicitly normalize parsed IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them against an IPv6 blocklist.
