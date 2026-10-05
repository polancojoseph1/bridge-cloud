## 2023-10-27 - [Trailing Dot SSRF Bypass]
**Vulnerability:** The SSRF prevention logic relied on parsing URLs and validating the hostname against a blocklist (e.g., checking if it's `localhost`). However, the URL parser preserves trailing dots (e.g., `localhost.`), which is a valid FQDN but bypassed the exact string match `=== 'localhost'`.
**Learning:** Naive string comparisons for domain matching in SSRF checks are vulnerable to normalization bypasses, as underlying network stacks often resolve domains with trailing dots the same as those without, while string checks fail.
**Prevention:** Always normalize hostnames by explicitly stripping trailing dots (`.replace(/\.$/, '')`) before validating them against blocklists or performing SSRF checks.
