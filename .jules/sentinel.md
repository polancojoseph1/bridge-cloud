## 2024-05-18 - SSRF FQDN Bypass
**Vulnerability:** Fully Qualified Domain Names (e.g., localhost.) and URL encoded hostnames bypassed the SSRF protection string matching.
**Learning:** `fetch` resolves FQDNs with trailing dots, which evade exact string matches like `cleanHn === 'localhost'`. URL encoding like `%2e` can also evade exact matches.
**Prevention:** URL decode the hostname and strip trailing dots before performing SSRF blocklist validation.
