## 2026-10-16 - SSRF Bypass via Trailing Dots
**Vulnerability:** Exact-match hostname blocklists for SSRF prevention could be bypassed by appending a trailing dot to the domain (e.g., `localhost.`), which Node.js's `URL` class preserves in its parsed `hostname` property.
**Learning:** Node.js's `URL` class does not strip trailing dots from non-IP hostnames during parsing, allowing attackers to bypass simple string equality checks like `cleanHn === 'localhost'`.
**Prevention:** Always explicitly strip trailing dots using a regex (e.g., `\.+$/`) from the parsed hostname before validating it against blocklists or passing it to DNS resolution.
