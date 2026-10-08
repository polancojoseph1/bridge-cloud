## 2026-10-08 - Fix SSRF Bypass via Trailing Dots
**Vulnerability:** The SSRF blocklist could be bypassed by appending a trailing dot to the hostname (e.g., `127.0.0.1.` or `localhost.`).
**Learning:** Node.js's `URL` class preserves trailing dots in hostnames, which bypasses exact-match and IP parsing checks.
**Prevention:** Always strip trailing dots using `.replace(/\.$/, '')` from the parsed hostname before validating it.
