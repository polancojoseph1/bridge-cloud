## 2024-05-24 - SSRF Bypass via Unnormalized IPv6 Address
**Vulnerability:** The SSRF protection in `src/lib/ssrf.ts` validated IPv6 hostnames using raw string matching, which allowed bypasses using equivalent representations (e.g., `0::1`, zero-padding) because Node.js `dns.promises.lookup()` resolves these representations but does not normalize them before returning.
**Learning:** In Node.js, `dns.promises.lookup()` does not normalize resolved IPv6 addresses (e.g., returning `0::1` verbatim). Simple string equality checks for IPv6 addresses are insufficient against SSRF.
**Prevention:** When validating resolved IPs for SSRF protections, normalize them explicitly using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist.
