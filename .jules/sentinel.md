## 2024-05-18 - [SSRF Bypass via FQDN (Trailing Dot)]
**Vulnerability:** The SSRF blocklist bypasses when hostnames have a trailing dot (e.g., `localhost.`), which circumvents exact string matches but successfully resolves in `fetch` and DNS lookups.
**Learning:** URL decoding needs to happen prior to sanitization, and trailing dots must be stripped (`.replace(/\.+$/, '')`) *before* applying the blocklist matching.
**Prevention:** Always normalize the hostname before validation.
