## 2024-05-18 - SSRF Filter Bypass with Trailing Dots and URL Encoding
**Vulnerability:** The `isForbiddenHostname` function used exact string matching (`cleanHn === 'localhost'`) against hostnames without prior URL decoding or stripping trailing dots (FQDNs).
**Learning:** Attackers could bypass SSRF checks using Fully Qualified Domain Names (e.g., `localhost.`) or URL-encoded dots/characters (`%6Cocalhost.`), which evade simple exact string matches but are still resolved by Node's fetch and DNS lookups.
**Prevention:** Always URL-decode hostnames (wrapping in a try/catch) and strip trailing dots (`.replace(/\.+$/, '')`) *before* executing blocklist validation to ensure canonical hostname evaluation.
