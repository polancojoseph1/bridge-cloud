## 2024-11-20 - Fix SSRF IPv6 Normalization Bypass
**Vulnerability:** The SSRF blocklist could be bypassed using unnormalized IPv6 addresses like `0::1`, which was blocked as `::1` but string comparison failed.
**Learning:** `dns.promises.lookup` (used for DNS resolution checks) doesn't normalize resolved IPv6 addresses, so validation functions must manually normalize IPv6 using `URL` before blocking.
**Prevention:** Always parse and normalize IPv6 addresses using Node.js's URL class or a robust IP validation library before matching them against a blocklist.
