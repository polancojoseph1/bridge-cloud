## 2024-11-10 - Sentinel SSRF bypass fix
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) bypass due to incomplete parsing of IPv4-compatible IPv6 addresses.
**Learning:** Node.js URL parsing normalizes IPv4-mapped and compatible IPv6 addresses into hexadecimal format `[::c0a8:101]`, which bypasses simple `startsWith('::ffff:')` prefix checks.
**Prevention:** Explicitly parse hexadecimal-encoded IPv4-compatible IPv6 addresses, extract the embedded IPv4 payload, and run it through the IPv4 blocklist.
