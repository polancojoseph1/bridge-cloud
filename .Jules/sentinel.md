## 2024-05-24 - SSRF FQDN and URL-encoding Bypass
**Vulnerability:** The SSRF blocklist in `isForbiddenHostname` could be bypassed using Fully Qualified Domain Names (e.g., `localhost.`) or URL-encoded characters (e.g., `%2e`), which bypass exact string matches but are valid for DNS and `fetch`.
**Learning:** Checking strict exact string matches on raw URLs is insufficient for SSRF protection because `fetch` and DNS resolution normalize FQDNs and decode URL-encoded parts, which causes the verification to drift from execution.
**Prevention:** Always `decodeURIComponent` and strip trailing dots (e.g., `\.+$`) from the parsed hostname *before* validating against the blocklist.
