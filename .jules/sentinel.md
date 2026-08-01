## 2024-05-24 - Fix SSRF IPv6 Filter Bypass
**Vulnerability:** Zero-compressed and zero-padded IPv6 addresses bypassed SSRF protections.
**Learning:** dns.promises.lookup() doesn't normalize IPv6 addresses and string equality fails for different IPv6 representations.
**Prevention:** Use new URL('http://[' + ip + ']').hostname.slice(1, -1) to normalize IPv6 addresses before validation.
