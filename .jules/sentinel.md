## 2024-05-24 - SSRF Bypass via Trailing Dots and URL Encoding
**Vulnerability:** The SSRF prevention logic failed to decode URL-encoded domains and did not strip trailing dots (e.g., `localhost.` or `localhost%2e`). This allowed attackers to bypass the blocklist using Fully Qualified Domain Names (FQDNs) or encoded payloads.
**Learning:** Hostnames parsed from URLs or input strings must be explicitly URL-decoded and stripped of FQDN trailing dots *before* exact string matching against blocklists, because underlying `fetch` and DNS resolution correctly handle FQDNs and URL encodings.
**Prevention:** Always normalize hostnames by URL-decoding (within a try/catch for malformed URIs) and removing trailing dots (`.replace(/\.+$/, '')`) prior to validating against SSRF blocklists.
