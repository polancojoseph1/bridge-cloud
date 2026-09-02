## 2024-09-02 - SSRF Bypass via IPv6 Zero-Padding
**Vulnerability:** The SSRF protection logic used strict string equality (`cleanHn === '::1'`) to block IPv6 loopback addresses. This allows attackers to bypass the filter using zero-padding or zero-compression variations like `0000:0000:0000:0000:0000:0000:0000:0001`.
**Learning:** IPv6 addresses have multiple valid string representations. Strict string comparison is insufficient for security filtering.
**Prevention:** Always normalize IPv6 addresses (e.g., using Node.js's built-in `URL` class to construct and extract the hostname) before performing security validations against known forbidden ranges.
