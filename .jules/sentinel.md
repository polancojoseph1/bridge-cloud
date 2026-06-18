## 2026-06-18 - SSRF Bypass via FQDN Trailing Dots and URL-encoded Hostnames
**Vulnerability:** Server-Side Request Forgery (SSRF) blocklist bypass allowing attackers to access internal services using hostnames with trailing dots (e.g., `localhost.`) or URL-encoded payloads.
**Learning:** `new URL()` preserves trailing dots in hostnames and does not decode URL-encoded parts, which evade exact string matches in blocklists while still resolving successfully in DNS lookups.
**Prevention:** Always URL-decode and strip trailing dots (`\.+$`) from hostnames before validating them against SSRF blocklists.
