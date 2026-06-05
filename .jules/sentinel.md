## 2026-06-05 - SSRF Bypass via FQDN and URL Encoding
**Vulnerability:** The SSRF blocklist in `isForbiddenHostname` could be bypassed using Fully Qualified Domain Names (e.g., `localhost.`) or URL encoding (e.g., `%6c%6f%63%61%6c%68%6f%73%74`).
**Learning:** Exact string matching for hostname validation is insufficient. Attackers can use trailing dots or encode characters to evade blocklists while the underlying fetch or DNS lookup still resolves them correctly.
**Prevention:** Always URL-decode hostnames (wrapped in try/catch) and strip trailing dots (`/\.+$/`) *before* applying exact string or regex validation against a blocklist.
