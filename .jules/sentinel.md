## 2024-08-12 - Prevent SSRF bypass via IPv6 unnormalized addresses
**Vulnerability:** The SSRF protection filter in `isForbiddenHostname` relied on strict string equality for IPv6 addresses (`::1`), allowing trivial bypasses via equivalent representations like `0::1` or `0000:0000:0000:0000:0000:0000:0000:0001`. This was critical because `dns.promises.lookup()` returns unnormalized IPv6 strings.
**Learning:** In Node.js, `dns.promises.lookup()` does not normalize resolved IPv6 addresses. Filtering them via strict string comparison is insecure.
**Prevention:** Always normalize resolved IPv6 addresses explicitly (e.g., using `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) before validating them against a blocklist.
