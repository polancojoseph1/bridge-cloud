## 2026-09-16 - SSRF Filter Bypass via IPv6 Formatting
**Vulnerability:** The SSRF prevention logic blocked specific canonical IPv6 addresses (e.g. ::1) but allowed non-canonical representations (e.g. 0000::1, 0:0:0:0:0:0:0:1) to bypass checks.
**Learning:** Checking hardcoded strings for IPv6 addresses is prone to bypasses because IPv6 permits various valid formatting styles, including zero compression and zero padding.
**Prevention:** Always parse and normalize IPv6 addresses using the built-in Node.js URL parser before applying any string-matching blocklist validations.
