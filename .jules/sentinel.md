## 2026-10-22 - Prevent trailing dot SSRF bypass in URL parsing
**Vulnerability:** The SSRF prevention logic relied on hostname checking but failed to account for Node.js URL class behavior, where trailing dots in hostnames (e.g. localhost.) are preserved. This allowed an attacker to bypass exact-match blocks (localhost) by appending a trailing dot.
**Learning:** DNS and URL parser inconsistencies (especially regarding trailing periods that designate the root of the DNS hierarchy) can easily break string-based domain blocklists.
**Prevention:** Always normalize hostnames by explicitly stripping trailing dots before performing string-matching against blocklists in SSRF prevention mechanisms.
