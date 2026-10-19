## 2026-10-19 - SSRF Bypass via Trailing Dots
**Vulnerability:** Node.js URL parser preserves trailing dots in hostnames (e.g., `localhost.`), allowing SSRF bypasses against exact-match or simple blocking logic.
**Learning:** Non-IP hostnames with trailing dots must be normalized before validation against blocklists, otherwise a dot can bypass exact string matches while still resolving locally.
**Prevention:** Explicitly strip trailing dots using `replace(/\.+$/, '')` on the hostname before applying SSRF checks.
