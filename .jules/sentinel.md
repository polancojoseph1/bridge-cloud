## 2026-10-12 - SSRF Bypass via Trailing Dot in Hostname
**Vulnerability:** The SSRF validation logic in `isForbiddenHostname` failed to account for fully qualified domain names (FQDNs) ending with a trailing dot (e.g., `127.0.0.1.`, `localhost.`). This allowed bypassing exact-match IP blocklists because standard node `URL` resolution preserves the trailing dot on parsing.
**Learning:** Node.js's `URL` class retains trailing dots on hostnames which bypass simple string equivalency checks, allowing internal network access through an open proxy endpoint.
**Prevention:** Always explicitly strip trailing dots (e.g., using `.replace(/\.$/, '')`) from a parsed hostname before running it against blocklists or performing string-based SSRF validation.
