## 2024-05-24 - Prevent SSRF bypasses via URL-encoded characters and FQDNs
**Vulnerability:** Bypassing SSRF blocklists using trailing dots (e.g., `localhost.`) or URL-encoded dots (`%2e`).
**Learning:** Fully Qualified Domain Names (FQDNs) and URL-encoded hostnames can evade exact string matches in blocklists while still successfully resolving via DNS lookups or `fetch`.
**Prevention:** URL-decode the hostname (with a try/catch for malformed URIs) and strip trailing dots (`.replace(/\.+$/, '')`) *before* applying any validation or blocklist checks.
