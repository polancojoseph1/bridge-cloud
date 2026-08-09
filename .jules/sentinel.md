## 2024-08-09 - IPv6 Normalization Bypass in SSRF Filter
**Vulnerability:** The SSRF protection logic in `src/lib/ssrf.ts` blocked `::1` using exact string matching (`cleanHn === '::1'`). This allowed bypasses using unnormalized IPv6 formats (e.g., zero-padded `0000:0000:0000:0000:0000:0000:0000:0001` or zero-compressed `0::1`).
**Learning:** `dns.promises.lookup()` and basic string matching do not normalize resolved IPv6 addresses.
**Prevention:** Always normalize IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them against blocklists for SSRF mitigation.
