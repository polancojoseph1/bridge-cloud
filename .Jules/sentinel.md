## 2024-06-07 - SSRF Filter Bypass via FQDN & URL Encoding
**Vulnerability:** The `isForbiddenHostname` function allowed SSRF blocklist bypasses when the hostname included URL-encoded characters (like `%2e` for `.`) or trailing dots (e.g., `localhost.` or `127.0.0.1.`).
**Learning:** `fetch` and DNS lookups successfully resolve Fully Qualified Domain Names (FQDNs) ending with a dot and automatically handle URL-encoded components, but exact string matches in validation functions will miss these obfuscated formats.
**Prevention:** Always URL-decode the hostname and strip trailing dots (`.replace(/\.+$/, '')`) *before* applying SSRF checks. Wrap the decode operation in a try/catch to handle malformed URIs without crashing.
