## 2025-03-01 - IPv6 Normalization Bypass in SSRF Protection
**Vulnerability:** Node.js DNS resolution does not automatically normalize IPv6 addresses (e.g. `0::1` bypasses strict `::1` matching).
**Learning:** Checking IPv6 string equality directly without normalization allows attackers to bypass blocklists utilizing zero-compression and zero-padding techniques.
**Prevention:** Always normalize resolved IPv6 addresses via `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing against forbidden IPs or subnets.
