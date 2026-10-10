## 2026-10-10 - SSRF Trailing Dot Bypass
**Vulnerability:** The SSRF check `isForbiddenHostname` could be bypassed by appending a trailing dot to the domain or IP (e.g., `127.0.0.1.` or `localhost.`). Node's `URL` parsing preserves this trailing dot, but DNS resolution implicitly ignores it.
**Learning:** Node.js URL parsing doesn't strip trailing dots, which circumvents exact-match IP blocklists.
**Prevention:** Explicitly strip trailing dots from parsed hostnames (e.g., `.replace(/\.$/, '')`) before passing them to validation functions.
