## 2025-02-21 - IPv6 SSRF Bypass Fix
**Vulnerability:** Node.js DNS lookup does not normalize IPv6 addresses, allowing SSRF filter bypass using alternative representations like `0::1`.
**Learning:** SSRF protections must robustly parse and normalize IPv6 addresses before string comparison.
**Prevention:** Always normalize resolved IPs (e.g., using `new URL()`) before checking against blocklists.
