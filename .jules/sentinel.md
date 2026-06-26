## 2024-06-26 - SSRF Bypass via FQDNs and URL Encoding
**Vulnerability:** The SSRF blocklist in `isForbiddenHostname` failed to correctly normalize hostnames with trailing dots (Fully Qualified Domain Names like `localhost.`) or URL-encoded dots (`%2e`), which allowed bypasses but were still successfully resolved by DNS/fetch.
**Learning:** Exact string matches on hostnames without comprehensive normalization (including decoding and stripping trailing dots) leave the application vulnerable to SSRF.
**Prevention:** Ensure hostnames are URL-decoded (with a fallback for malformed strings) and have trailing dots stripped (`.replace(/\.+$/, '')`) *before* applying blocklist logic.
