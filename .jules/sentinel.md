## 2024-10-02 - SSRF bypass via uncompressed IPv6
**Vulnerability:** IPv6 addresses can be represented in multiple uncompressed formats (like `0:0:0:0:0:0:0:1` or `0:0:0:0:0:ffff:127.0.0.1`) which bypassed the simple string matching in `isForbiddenHostname`.
**Learning:** Never rely on simple string matching for IPv6 validation without normalizing the IP address format first, as attackers can use zero-padding and non-compressed formats to evade blocklists.
**Prevention:** Use Node's built-in `URL` parsing (e.g. `new URL('http://[' + ip + ']').hostname`) to automatically parse and normalize IPv6 addresses to their standard compressed format before running validation checks.
