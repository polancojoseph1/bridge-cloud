## 2026-10-15 - SSRF Bypass via Trailing Dots
**Vulnerability:** The Node.js URL class preserves trailing dots in parsed hostnames, allowing attackers to bypass strict equality or string-based domain blocklists (like 'localhost') by using URLs like 'http://localhost.'.
**Learning:** Hostname parsing can have edge cases like trailing dots which must be normalized before validating against blocklists or IP ranges.
**Prevention:** Explicitly strip trailing dots using a regex like `replace(/\.+$/, '')` on the parsed hostname before doing SSRF validation.
