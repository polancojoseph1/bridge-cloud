## 2025-02-14 - Fix SSRF bypass via unnormalized IPv6 addresses
**Vulnerability:** The SSRF protection logic in `src/lib/ssrf.ts` relied on strict string matching to block forbidden IPv6 addresses (e.g. `::1`). This could be bypassed using zero-compressed or zero-padded representations like `0::1` or `0000::0001`.
**Learning:** URL parsers (and network stacks) normalize equivalent IPv6 representations, but string comparisons do not. We must rely on standard normalization before performing blocklist validation.
**Prevention:** Always normalize hostnames or IP addresses (e.g., using `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) prior to validating them against security blocklists.
