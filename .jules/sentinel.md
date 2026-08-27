## 2024-05-24 - Fix IPv6 SSRF bypass vulnerability
**Vulnerability:** Naive string matching for IPv6 addresses allowed SSRF via zero-padding and zero-compression (e.g., `0000:0000:0000:0000:0000:0000:0000:0001` bypassed `::1` loopback check).
**Learning:** Never validate IPv6 or IPv4 addresses using strict string equality. Equivalent representations make string matching inherently insecure.
**Prevention:** Use an established parsing library like `ipaddr.js` to normalize and check address ranges securely.
