## 2025-06-12 - SSRF Bypass via FQDN and URL-encoding
**Vulnerability:** The SSRF blocklist allowed bypassing checks using FQDN notation (e.g. `localhost.`) or URL-encoded dots (`localhost%2e`).
**Learning:** URL hostnames can include trailing dots representing the DNS root, and fetch handlers might resolve them while exact string blocklists fail to match.
**Prevention:** Always decode the hostname and strip trailing dots (`.replace(/\.+$/, '')`) *before* executing blocklist checks.
