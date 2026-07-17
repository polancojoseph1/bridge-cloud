## 2024-07-17 - IPv6 Normalization Bypass
**Vulnerability:** IPv6 hostnames or addresses were validated using strict string equality (e.g., `ip === '::1'`). This could be bypassed using zero-compression and zero-padding (e.g., `0::1`, `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** `dns.promises.lookup()` does not normalize resolved IPv6 addresses, so SSRF protections based on blocklists can fail if standard normalization isn't applied.
**Prevention:** Normalize IPv6 addresses explicitly using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before comparing them to a blocklist or using robust regex that handles equivalent representations.
