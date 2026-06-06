## 2025-02-19 - SSRF Bypass via Fully Qualified Domain Names (FQDN)
**Vulnerability:** The SSRF prevention logic blocked `localhost` but could be bypassed by appending a trailing dot (`localhost.`) or its URL-encoded equivalent (`localhost%2e`). `fetch` and DNS lookups successfully resolve FQDNs with trailing dots, allowing attackers to access internal endpoints.
**Learning:** SSRF blocklists using exact string matching or simple suffixes (`.endsWith()`) fail if hostnames are not properly decoded and stripped of FQDN trailing dots prior to validation.
**Prevention:** Always wrap hostname inputs in `decodeURIComponent` (with try/catch) and strip trailing dots (`.replace(/\.+$/, '')`) *before* evaluating against the blocklist to ensure obfuscated hostnames are normalized.
