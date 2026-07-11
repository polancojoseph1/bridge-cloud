## 2024-07-11 - SSRF Trailing Dot Evasion
**Vulnerability:** Trailing dot in URL hostname (e.g. `169.254.169.254.`) bypassed SSRF blacklist checks while still being valid for fetching/resolution.
**Learning:** URL hostnames can optionally include a trailing dot for fully qualified domain names, which breaks exact string and simple regex matching for SSRF protection.
**Prevention:** Always strip any trailing dot (`.replace(/\.$/, '')`) from the hostname before running SSRF blacklist or IP validation rules.
