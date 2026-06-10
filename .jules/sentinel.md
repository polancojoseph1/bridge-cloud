## 2024-05-24 - Fix SSRF Bypass via FQDN and URL Encoding
**Vulnerability:** The SSRF blocklist validation could be bypassed using Fully Qualified Domain Names (e.g., `localhost.`) or URL-encoded characters (e.g., `localhost%2e`).
**Learning:** `new URL()` preserves trailing dots in the hostname, and exact string matching fails if the input is not normalized by decoding and stripping these characters before validation.
**Prevention:** Always URL-decode and strip trailing dots `\.+$` from hostnames before validating against SSRF blocklists.
