
## 2025-02-27 - Server-Side Request Forgery (SSRF) bypass via trailing dots and URL-encoded dots
**Vulnerability:** The SSRF protection `isForbiddenHostname` was vulnerable to bypasses using Fully Qualified Domain Names (FQDNs) ending with a dot (e.g., `localhost.`) or URL-encoded dots (e.g., `localhost%2e`).
**Learning:** String matching on domain names for SSRF protection is insufficient because resolvers and parsers normalize domains differently. FQDNs with trailing dots are valid domain names, and standard library `fetch` or DNS resolvers will successfully resolve them. URL encoded characters bypass simple string matching.
**Prevention:** Ensure the hostname is URL-decoded (using `decodeURIComponent`, wrapped in a try/catch to handle malformed URIs) and trailing dots are stripped (e.g., `.replace(/\.+$/, '')`) *before* validation.
