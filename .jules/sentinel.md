## 2024-05-24 - Prevent SSRF Bypass via Zero-Padded IPv6 Addresses
**Vulnerability:** The SSRF protection in `src/lib/ssrf.ts` blocked `::1` but did not normalize IPv6 strings, allowing attackers to bypass checks using zero-padded versions (e.g., `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** Strict string comparisons for IPv6 addresses are insufficient because they have multiple valid string representations.
**Prevention:** Always normalize IP addresses (using robust parsers like the built-in `URL` class) before performing string-based blocking or validation checks.
