## 2025-02-12 - SSRF Bypass via FQDN (Trailing Dots)
**Vulnerability:** The `isForbiddenHostname` function fails to correctly identify FQDNs (Fully Qualified Domain Names) like `localhost.` or url-encoded variations like `localhost%2E`.
**Learning:** `new URL(url).hostname` returns the hostname with trailing dots intact, so strict string matching fails unless the string is decoded and trailing dots are stripped.
**Prevention:** URL-decode the hostname (wrapped in a try-catch for malformed URIs) and strip trailing dots `\.+$` before validation against blocklists.
