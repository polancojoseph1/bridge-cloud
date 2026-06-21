## 2024-06-21 - Fix SSRF Validation Bypass using Trailing Dots and URL Encoding
**Vulnerability:** Exact hostname checks for SSRF prevention (e.g. `if (hostname === 'localhost')`) could be bypassed by appending a trailing dot (`localhost.`) or URL-encoding characters (`localhost%2e`).
**Learning:** `new URL(url).hostname` does not normalize trailing dots or URL-encoded dots, creating Fully Qualified Domain Names (FQDNs) which evade exact string matches but are still successfully resolved by `fetch` or DNS lookups.
**Prevention:** Always URL-decode hostnames and strip trailing dots (e.g. `.replace(/\.+$/, '')`) *before* applying SSRF blocklist validation or exact string matching logic.
