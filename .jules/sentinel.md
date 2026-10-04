## 2026-10-04 - Fix SSRF bypass via trailing dot in FQDN
**Vulnerability:** The SSRF validation logic failed to account for Fully Qualified Domain Names (FQDN) that end with a trailing dot (e.g., `127.0.0.1.` or `localhost.`). This allowed bypassing exact-match and split-based IP blocklists because `new URL()` preserves the trailing dot in the parsed hostname.
**Learning:** Node.js's `URL` class retains the trailing dot of a domain name in its `hostname` property. Failing to sanitize this trailing dot before performing validations can lead to SSRF bypasses against standard localhost or private IP addresses.
**Prevention:** Always explicitly strip trailing dots from the parsed hostname (e.g., using `.replace(/\.$/, '')`) before applying security validations.
