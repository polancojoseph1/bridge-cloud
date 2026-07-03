## 2025-02-13 - [SSRF Bypass via FQDN and URL Encoding]
**Vulnerability:** The `isForbiddenHostname` SSRF blocklist could be bypassed using Fully Qualified Domain Names (e.g., `localhost.`) or URL-encoded dots (e.g., `localhost%2e`), which bypass exact string matching but still resolve successfully during `fetch` or DNS lookups.
**Learning:** Exact string matching against hostnames is insufficient because DNS resolvers and HTTP clients normalize these variations, allowing attackers to access internal endpoints.
**Prevention:** Always URL-decode hostnames and strip trailing dots before performing SSRF validation checks.
