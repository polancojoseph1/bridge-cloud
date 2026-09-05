## 2024-05-24 - IPv6 SSRF Bypass via Zero-Padding
**Vulnerability:** The SSRF protection logic used strict string equality to check IPv6 loopback addresses (e.g., `cleanHn === '::1'`). This allowed bypasses using zero-compression and zero-padding formats (e.g., `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** Strict string comparisons are insufficient for validating IP addresses because there are multiple valid textual representations for the same IP (especially for IPv6). Node.js's built-in `URL` class automatically normalizes these representations.
**Prevention:** Always use robust IP parsing/normalization logic (like `new URL('http://[' + ipv6 + ']').hostname.slice(1, -1)`) when enforcing IP-based blacklists or whitelists.
