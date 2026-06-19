## 2026-06-19 - SSRF Bypass via Unnormalized Hostnames
**Vulnerability:** The SSRF prevention blocklist in `src/lib/ssrf.ts` could be bypassed using Fully Qualified Domain Names (FQDNs) ending with a dot (e.g. `localhost.`) or URL-encoded dots (`%2e`), allowing unauthorized requests to internal endpoints.
**Learning:** Checking strict string matches against internal hostnames fails if the input hostname isn't properly decoded and trailing dots aren't stripped before validation. `fetch` and DNS resolution still successfully resolve FQDNs.
**Prevention:** Always normalize the hostname before checking it against SSRF blocklists. Wrap the hostname in a try/catch with `decodeURIComponent` to handle malformed URIs and strip trailing dots using `.replace(/\.+$/, '')` before validation.
