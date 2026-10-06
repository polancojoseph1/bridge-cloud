## 2024-10-06 - SSRF Trailing Dot Bypass Mitigation
**Vulnerability:** Node.js's URL parser preserves trailing dots in Fully Qualified Domain Names (e.g., `new URL('http://127.0.0.1.').hostname` evaluates to `127.0.0.1.`). This could allow attackers to bypass exact-match or split-based IP blocklists in SSRF validation if trailing dots aren't handled.
**Learning:** Hostname normalization must consider trailing dots, as they act as valid FQDNs but bypass string matches like `=== 'localhost'`.
**Prevention:** Explicitly strip trailing dots (e.g., `.replace(/\.$/, '')`) from parsed hostnames before passing them to validation blocklists.
