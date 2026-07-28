## 2025-07-28 - SSRF Bypass via Unnormalized IPv6 Addresses
**Vulnerability:** The SSRF protection `isForbiddenHostname` was bypassed because it compared strictly against `::1` without normalizing equivalent IPv6 strings like `0::1` or zero-padded representations.
**Learning:** `dns.promises.lookup()` and Node.js networking utilities do not auto-normalize returned IPv6 address strings. Strict string equality checks on IPs are dangerous.
**Prevention:** Always explicitly normalize IPv6 addresses using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing against blocklists.
