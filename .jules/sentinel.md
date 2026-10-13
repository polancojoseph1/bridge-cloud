## 2026-10-13 - SSRF bypass via trailing dots
**Vulnerability:** The SSRF validation logic in isForbiddenHostname was bypassed by appending trailing dots to hostnames (e.g., 127.0.0.1.).
**Learning:** Node.js's URL class preserves trailing dots in fully qualified domain names (FQDNs), which bypasses exact string matching or split-based blocking.
**Prevention:** Always normalize hostnames by explicitly stripping trailing dots before performing SSRF validation.
