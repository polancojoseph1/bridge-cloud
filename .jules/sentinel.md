## 2024-05-18 - SSRF Bypass via FQDN and URL-encoded Dots
**Vulnerability:** The SSRF blocklist (`isForbiddenHostname`) failed to block fully qualified domain names (e.g., `localhost.`) and URL-encoded dots (e.g., `localhost%2e`).
**Learning:** `fetch` and DNS resolution correctly interpret domains with a trailing dot or encoded characters, bypassing exact string matches against `localhost`.
**Prevention:** Always URL-decode hostnames and strip trailing dots *before* evaluating them against blocklists.
