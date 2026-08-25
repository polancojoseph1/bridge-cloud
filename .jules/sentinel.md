## 2026-08-25 - Prevent IPv6 SSRF Bypass with Normalization
**Vulnerability:** The blocklist bypassed non-normalized IPv6 addresses like `0::1` or zero-padded representations due to string-based checks.
**Learning:** Normalizing resolved IPv6 addresses explicitly via `new URL('http://[' + ip + ']').hostname.slice(1, -1)` is necessary to ensure strict matching against blocklists in SSRF protections.
**Prevention:** Always normalize resolved IPs before comparing to blocklist checks rather than relying on exact string matches.
