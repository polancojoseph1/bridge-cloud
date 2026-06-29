## 2024-05-30 - Prevent SSRF Filter Bypass via URL-Encoding and Trailing Dots
**Vulnerability:** The SSRF blocklist could be bypassed using trailing dots (e.g., `localhost.`) or URL-encoded characters (e.g., `%2e`) which evaded exact string matches but were successfully resolved by `fetch`.
**Learning:** Attackers can use FQDNs with trailing dots or URL-encoding to bypass naive string-matching blocklists in hostname validation.
**Prevention:** Always URL-decode hostnames and strip trailing dots before performing SSRF validation checks.
