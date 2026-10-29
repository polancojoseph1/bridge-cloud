## 2024-10-29 - SSRF Bypass via IPv4-Compatible IPv6

**Vulnerability:** The Node.js `URL` parser normalizes IPv4-compatible IPv6 loopbacks (e.g. `[::127.0.0.1]`) into their pure hex format (e.g. `[::7f00:1]`). The SSRF blocklist only checked for standard IPv4/IPv6 and IPv4-mapped IPv6 formats, allowing the hex-encoded loopback formats to bypass internal blocks.
**Learning:** Due to how core libraries interpret IPs before application logic validates them, standard format checks are insufficient without covering all possible encoded representations (like IPv4-compatible IPv6 addresses) that could evaluate to an internal network block.
**Prevention:** Explicitly parse and block these hex-encoded IPv4-compatible IPv6 formats (`::XXXX:XXXX` or `::XXXX`) within the SSRF protection mechanism, ensuring they map back to internal IPv4 ranges for correct block evaluation.
