## 2025-02-14 - Fix SSRF Vulnerability in IPv6 Validation
**Vulnerability:** The application was using strict string equality to check for forbidden IPv6 addresses (e.g. `if (cleanHn === '::1') return true;`), which could be bypassed using equivalent zero-compressed or zero-padded representations (like `0::1` or `0:0:0:0:0:0:0:1`).
**Learning:** Checking IPs by naive string matching is insecure for IPv6 because a single IP can have multiple valid textual representations.
**Prevention:** Always normalize IP addresses using built-in URL parsers or dedicated networking libraries before validating them against a blocklist.
