## 2026-08-31 - IPv6 zero-padding bypass for SSRF defenses
**Vulnerability:** The SSRF guard used a strict string comparison `cleanHn === '::1'` to block the IPv6 loopback address, which could be bypassed using zero-padded or uncompressed representations like `0000:0000:0000:0000:0000:0000:0000:0001`.
**Learning:** IPv6 addresses can be represented in multiple equivalent string formats. String equality checks are insufficient for validating IP addresses.
**Prevention:** Always normalize IP addresses (e.g., using the `URL` API which natively normalizes IPv6 hostnames) before performing validation or filtering.
