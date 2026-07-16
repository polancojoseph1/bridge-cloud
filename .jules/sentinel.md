## 2024-05-23 - Fix IPv6 SSRF bypass
**Vulnerability:** Incomplete SSRF protection due to strict string matching on IPv6 addresses (e.g. ::1). Can be bypassed with padded forms (e.g. 0::1).
**Learning:** dns.promises.lookup() and some other tools may return non-normalized IPv6 strings, and Node.js does not normalize them automatically.
**Prevention:** Normalize IPv6 addresses explicitly using new URL('http://[' + ip + ']').hostname.slice(1, -1) before comparing against a blocklist.
