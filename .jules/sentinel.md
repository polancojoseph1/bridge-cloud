## 2024-08-02 - SSRF Bypass via IPv6 Zero-Compression
**Vulnerability:** The SSRF protection logic used strict string equality (`cleanHn === '::1'`) to block internal IPv6 addresses, which could be bypassed using zero-compression and zero-padding variations (e.g., `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** In Node.js, `dns.promises.lookup()` does not normalize resolved IPv6 addresses, meaning verbatim bypassed strings could reach downstream fetch calls and target internal endpoints.
**Prevention:** When validating resolved IPs for SSRF protections, always normalize them explicitly (e.g., `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) before comparing them to a blocklist to handle all equivalent representations.
