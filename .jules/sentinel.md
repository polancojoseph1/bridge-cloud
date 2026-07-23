## 2025-02-14 - Fix SSRF bypass via unnormalized IPv6 addresses
**Vulnerability:** The application was vulnerable to SSRF bypasses because it relied on `hn.includes(':')` and a blocklist that only checked exact matches like `::1`. It didn't account for IPv6 address zero-compression and zero-padding (e.g., `0::1`, `0000::1`), allowing bypasses to internal networks since `dns.promises.lookup()` returns these unnormalized addresses verbatim in Node.js.
**Learning:** In Node.js, `dns.promises.lookup()` does not normalize resolved IPv6 addresses.
**Prevention:** Always normalize parsed IPv6 hostnames using the WHATWG `URL` constructor (e.g., `new URL('http://[' + cleanHn + ']').hostname.slice(1, -1)`) before comparing them against blocklists.
