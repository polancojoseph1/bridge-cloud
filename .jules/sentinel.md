## 2024-05-16 - SSRF Bypass via Unnormalized IPv6 Addresses
**Vulnerability:** The application's SSRF protection allowed bypassing loopback (`::1`) restrictions by using alternative IPv6 representations like `0::1`, zero-padding, or uncompressed forms because it relied on strict string matching.
**Learning:** `dns.promises.lookup()` in Node.js does not normalize resolved IPv6 addresses (e.g., returning `0::1` verbatim). This leads to a mismatch between the resolved IP and blocklists if not correctly handled.
**Prevention:** When validating resolved IPs or user input for SSRF protections, normalize IPv6 addresses explicitly using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist to avoid bypasses via alternative representations.
