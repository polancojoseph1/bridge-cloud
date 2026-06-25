## 2024-05-24 - Fix SSRF bypass via trailing dots and URL encoding
**Vulnerability:** The SSRF blocklist could be bypassed by appending a trailing dot to the hostname (e.g. `localhost.`) or using URL-encoded characters (e.g., `localhost%2e`).
**Learning:** `new URL()` preserves trailing dots and URL-encoded strings in the hostname property, which evade exact string matching blocklists, but are still successfully resolved by DNS or the `fetch` API.
**Prevention:** Always URL-decode hostnames (wrapped in try/catch) and explicitly strip trailing dots (e.g., `.replace(/\.+$/, '')`) *before* applying blocklist validations.
