## 2024-05-30 - SSRF IPv6 zero-padding bypass
**Vulnerability:** The application was vulnerable to an SSRF bypass where malicious IPv6 addresses were obfuscated using zero-padding or zero-compression (e.g., `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** Using strict string equality for IPv6 hostnames is insecure because IPv6 allows multiple equivalent string representations.
**Prevention:** Always normalize IPv6 addresses before validation. Node's built-in `URL` class can automatically normalize IPv6 IPs.
