## 2024-05-24 - Fix SSRF bypass via FQDN and URL-encoding
**Vulnerability:** The SSRF protection `isForbiddenHostname` was bypassed using Fully Qualified Domain Names (FQDNs) with a trailing dot (e.g., `localhost.`) or URL-encoded dots (e.g., `localhost%2e`).
**Learning:** Exact string matches fail against hostname variations that are correctly resolved by DNS and `fetch`.
**Prevention:** Always URL-decode hostnames and strip trailing dots *before* applying validation checks against blocklists.
