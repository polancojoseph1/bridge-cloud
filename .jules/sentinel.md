## 2024-05-31 - SSRF Validation Bypass via Trailing Dots and URL Encoding
**Vulnerability:** The `isForbiddenHostname` function was vulnerable to bypasses using trailing dots (e.g., `localhost.`) and URL encoding (e.g., `%6Coc%61lh%6fst`).
**Learning:** Exact string matching for hostname validation fails when hostnames are provided as Fully Qualified Domain Names (FQDNs) with trailing dots or URL-encoded characters. `fetch` and DNS lookups successfully resolve these, circumventing simple string-based checks.
**Prevention:** Always `decodeURIComponent` and strip trailing dots (`.replace(/\.+$/, '')`) *before* executing blocklist validation on hostnames.
