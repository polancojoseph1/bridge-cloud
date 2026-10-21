## 2026-10-21 - Prevent SSRF Bypass with Trailing Dots in FQDNs
**Vulnerability:** Exact-match blocklists for internal domain names and IPs were bypassable due to how Node.js's URL class preserves trailing dots in parsed hostnames (e.g. `new URL('http://localhost.').hostname === 'localhost.'`).
**Learning:** Trailing dots in Fully Qualified Domain Names (FQDNs) are valid in DNS requests and preserved by `URL` parsing, but not caught by string equality checks like `hn === 'localhost'`. This allows bypassing SSRF filters that don't account for trailing dots.
**Prevention:** Explicitly strip trailing dots using a regex (e.g., `\.+$`) before validating hostnames or IPs for SSRF protection.
