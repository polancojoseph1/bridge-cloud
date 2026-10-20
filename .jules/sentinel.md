## 2026-10-20 - SSRF Bypass via Trailing Dot
**Vulnerability:** The SSRF validation logic failed to strip trailing dots from hostnames, allowing attackers to bypass the filter (e.g., using 'localhost.').
**Learning:** Node.js's URL class preserves trailing dots in parsed hostnames. Exact string matches against blacklists can fail if normalization isn't properly handled.
**Prevention:** Always strip trailing dots from the parsed hostname string using regex (e.g., `replace(/\.+$/, '')`) before running it against blocklists.
