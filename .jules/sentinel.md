## 2025-06-09 - Fix SSRF Bypass via FQDN/Trailing Dots
**Vulnerability:** The SSRF prevention logic blocked `localhost` but failed to block `localhost.`, allowing bypass of the restrictions using a trailing dot (Fully Qualified Domain Name).
**Learning:** Trailing dots and URL encoding must be stripped and decoded *before* evaluating blacklisted hostnames, as these can evade exact string matches but are successfully resolved.
**Prevention:** Always URL-decode and strip `.` at the end of hostnames prior to checking against SSRF blocklists.
