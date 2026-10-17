## 2026-10-17 - SSRF Bypass via Trailing Dots in Node.js URL
**Vulnerability:** The SSRF blocklist could be bypassed by appending a trailing dot to the hostname (e.g., 127.0.0.1.). Node.js URL class preserves these trailing dots.
**Learning:** Node.js URL parsing preserves trailing dots, allowing bypass of exact-match string validation while DNS still resolves correctly.
**Prevention:** Always strip trailing dots using `.replace(/\.+$/, '')` from the parsed hostname before validation.
