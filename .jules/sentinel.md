## 2024-05-18 - [Fix IPv6 Normalization Bypass in SSRF Guard]
**Vulnerability:** Node.js dns.promises.lookup returns unnormalized IPv6 addresses like 0::1 or zero-padded IPs. The SSRF guard checked these using strict string equality (e.g. === '::1'), allowing bypassing of internal IP blocks.
**Learning:** String equality or simple regex checks for IPv6 addresses are dangerous because IPv6 has multiple valid representations (zero-compression, zero-padding).
**Prevention:** Always normalize resolved IPv6 addresses using new URL('http://[' + ip + ']').hostname.slice(1, -1) before comparing them to a blocklist.
