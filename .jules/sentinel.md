## 2024-07-25 - Fix SSRF bypass for .internal domains
**Vulnerability:** The SSRF prevention logic did not block `.internal` domains, which are commonly used for internal routing in VPCs.
**Learning:** `.internal` is a common top-level domain for internal routing in VPCs and should always be blocked to prevent SSRF. Furthermore, NEVER remove robust obfuscated IP parsing (like handling hex/octal IPs) from security utility functions, even if you assume the caller uses `new URL()` to normalize it. Removing it breaks defense-in-depth and makes the utility fragile.
**Prevention:** Always include standard internal domains like `.internal` in SSRF blocklists. Maintain defense-in-depth in security utilities and do not rely on implicit caller behavior for critical sanitization.
