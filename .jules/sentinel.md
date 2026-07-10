## 2024-05-24 - SSRF Blocklist Bypass via FQDN and URL Encoding
**Vulnerability:** The SSRF blocklist could be bypassed by appending a trailing dot (`localhost.`) or URL-encoding the hostname (`%6c%6f%63%61%6c%68%6f%73%74`).
**Learning:** Exact string matching in blocklists is insufficient because networking libraries (`fetch`, `dns.lookup`) inherently decode URIs and successfully resolve Fully Qualified Domain Names (FQDNs) with trailing dots.
**Prevention:** Always decode user input and strip trailing dots (`.replace(/\.+$/, '')`) *before* executing blocklist validation to normalize the hostname accurately.
