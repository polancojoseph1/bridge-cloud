## 2024-11-20 - SSRF Filter Bypass via URL Encoding and Trailing Dots
**Vulnerability:** The `isForbiddenHostname` SSRF prevention filter could be bypassed by URL-encoding characters (e.g. `localhost%2e`) or by appending a trailing dot to create a Fully Qualified Domain Name (e.g. `localhost.`).
**Learning:** `fetch` and DNS resolution correctly interpret URL-encoded hostnames and trailing dots, but simple string matching filters (`=== 'localhost'`) fail to catch them. The hostname must be normalized (decoded and trimmed of trailing dots) *before* validation.
**Prevention:** Always `decodeURIComponent` the hostname and strip trailing dots (`.replace(/\.+$/, '')`) prior to applying SSRF blocklists or exact string match logic.
