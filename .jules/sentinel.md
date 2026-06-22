## 2025-02-19 - SSRF Bypass via Fully Qualified Domain Names (Trailing Dots)
**Vulnerability:** URL blocklists could be bypassed by appending a trailing dot to the hostname (e.g., `127.0.0.1.` or `localhost.`), which evades exact string matches but is still successfully resolved by DNS lookups and `fetch`.
**Learning:** The URL parser natively handles trailing dots as valid Fully Qualified Domain Names (FQDNs), but manual SSRF protection logic often forgets to account for them.
**Prevention:** Always sanitize the URL-decoded hostname by stripping trailing dots (e.g., `.replace(/\.+$/, '')`) and removing surrounding brackets before passing the hostname into IP or domain validation logic.
