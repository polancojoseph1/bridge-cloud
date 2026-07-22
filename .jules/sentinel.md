## 2024-11-20 - SSRF IPv6 Normalization Bypass
**Vulnerability:** Incomplete SSRF protection due to exact string matching on IPv6 addresses which can be bypassed via zero-compression and zero-padding (e.g., `0::1`, `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** `dns.promises.lookup()` and basic string equality checks in Node.js do not normalize IPv6 addresses, leaving SSRF vulnerabilities open.
**Prevention:** Always parse and normalize resolved IPv6 addresses utilizing `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing against a blocklist.
