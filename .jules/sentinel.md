
## 2025-02-28 - SSRF Bypass via Node.js URL IPv6 Normalization
**Vulnerability:** The SSRF blocklist in `isForbiddenHostname` failed to block loopback and internal IP addresses when supplied as IPv4-compatible IPv6 addresses (e.g., `http://[::127.0.0.1]`).
**Learning:** Node.js's built-in `URL` class normalizes standard IPv4-compatible and IPv4-mapped IPv6 addresses into their pure hex representations (e.g., `[::127.0.0.1]` becomes `[::7f00:1]`). If custom IPv4 regexes or hex parsers do not explicitly expect these hex-only IPv6 formats, malicious inputs can bypass IP blocklists entirely.
**Prevention:** Always parse and normalize IPv4-compatible (`/^::(?:ffff:)?([0-9a-f]{1,4})(?::([0-9a-f]{1,4}))?$/i`) hex formats in URL hostname validations when protecting against SSRF, applying standard IPv4 rules to the extracted 32-bit integer.
