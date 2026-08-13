## 2024-08-13 - [CRITICAL/HIGH] Fix SSRF Bypass via Zero-Compressed IPv6
**Vulnerability:** Node.js `dns.promises.lookup` does not normalize resolved IPv6 addresses, allowing equivalent representations like `0::1` to bypass strict string equality SSRF blocklists.
**Learning:** IPv6 hostnames must always be explicitly normalized (e.g., using the native `URL` parser or robust parsing libraries) before validation, as exact string matching is insufficient.
**Prevention:** Normalize IPv6 addresses in `src/lib/ssrf.ts` using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing against forbidden patterns.
