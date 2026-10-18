## 2026-10-18 - SSRF Bypass via Trailing Dots
**Vulnerability:** Trailing dots in URLs (e.g. `127.0.0.1.`, `localhost.`) bypassed SSRF filters because Node.js's `URL` class preserves them in the hostname, failing exact matches.
**Learning:** Hostname parsing often leaves trailing dots intact. When doing explicit blocking or exact hostname matching, the dot must be explicitly removed.
**Prevention:** Always strip trailing dots (`replace(/\.+$/, '')`) from hostnames after stripping brackets but before applying validation logic.
