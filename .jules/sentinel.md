## 2024-06-23 - Prevent SSRF bypasses with FQDNs and encoding
**Vulnerability:** The SSRF blocklist allowed bypassing checks using FQDNs (like `localhost.`) or URL-encoded inputs (like `localhost%2e`).
**Learning:** Checking a hostname directly against a string blocklist is insufficient when DNS resolvers correctly resolve FQDNs and `fetch` handles URL-encoded hosts transparently.
**Prevention:** Always decode the URI component, strip trailing dots, and normalize the string before validating against any SSRF blocklists.
