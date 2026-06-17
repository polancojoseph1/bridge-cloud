## 2025-02-17 - SSRF Bypass via FQDN and URL Encoding
**Vulnerability:** The SSRF protection (`isForbiddenHostname`) was vulnerable to bypasses using Fully Qualified Domain Names (e.g., `localhost.`) and URL-encoded strings (e.g., `%6c%6f%63%61%6c%68%6f%73%74`).
**Learning:** Checking strict equality against `localhost` without stripping trailing dots allows the OS to resolve FQDNs while evading validation. `new URL()` does not automatically URL-decode hostnames if they are explicitly encoded, further permitting evasion.
**Prevention:** Always URL-decode hostnames, strip trailing dots (`.replace(/\.+$/, '')`), and remove IPv6 brackets before running string matching or IP parsing for SSRF mitigation.
