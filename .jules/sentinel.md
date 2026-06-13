## 2025-03-01 - SSRF Bypass via FQDNs
**Vulnerability:** The SSRF blocklist (`isForbiddenHostname`) failed to account for Fully Qualified Domain Names (FQDNs) containing trailing dots (e.g., `localhost.`, `127.0.0.1.`), allowing bypass of exact string matching.
**Learning:** Node's `new URL()` does not automatically strip trailing dots from the `hostname` property, yet `fetch` and underlying DNS lookups will successfully resolve these FQDNs to internal network destinations.
**Prevention:** Always URL-decode hostnames and strip trailing dots (`.replace(/\.+$/, '')`) before performing blocklist validation against exact matches or IP ranges.
