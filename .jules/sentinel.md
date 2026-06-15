
## 2024-06-15 - SSRF Bypass via FQDN and URL Encoding
**Vulnerability:** The SSRF blocklist could be bypassed by using Fully Qualified Domain Names (e.g., `localhost.`) or URL-encoded dots (`%2e`) because `isForbiddenHostname` matched exact strings without fully normalizing the hostname.
**Learning:** Exact string matching on hostnames is fragile without robust prior normalization (URL decoding and stripping trailing dots). Attackers can use valid but obscure representations to evade simple filters while still resolving correctly via DNS or fetch.
**Prevention:** Always sanitize, decode (wrapped in try/catch), and strip trailing dots from hostnames *before* applying SSRF blocklist checks. Relying on `new URL().hostname` handles some but not all edge cases like trailing dots when checking against custom string lists.
