## 2024-10-25 - SSRF bypass via IPv6 zero compression
**Vulnerability:** The `isForbiddenHostname` function checked IPv6 addresses strictly by string representation (e.g. `::1`). This allows attackers to bypass the filter by supplying zero-compressed variants (e.g. `0::1`, `0000::1`).
**Learning:** Node.js URL parser natively accepts and normalizes these variations but generic string filters do not.
**Prevention:** Normalize IPv6 addresses natively via the `URL` constructor (e.g., `new URL('http://[' + ip + ']').hostname.slice(1, -1)`) before comparing.
