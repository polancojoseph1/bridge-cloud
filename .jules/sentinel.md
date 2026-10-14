## 2026-10-14 - Fix SSRF trailing dot bypass in URL parser

**Vulnerability:** Node.js's URL class preserves trailing dots in non-IP hostnames (e.g., `localhost.`), which allows attackers to bypass exact-match SSRF IP/hostname blocklists (e.g., `cleanHn === 'localhost'`).
**Learning:** Standard string-based blacklist validation is insufficient for SSRF checks when the URL parser permits alternative valid FQDN syntaxes.
**Prevention:** Always strip trailing dots (`.replace(/\.+$/, '')`) from parsed hostnames before evaluating them against blocklists, or rely on resolved IP evaluation exclusively.
