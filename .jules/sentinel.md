## 2024-07-18 - SSRF bypass via unnormalized IPv6
**Vulnerability:** The `isForbiddenHostname` function checked IPv6 addresses for loopback and other restricted addresses using strict string matching (e.g., `cleanHn === '::1'`). This allowed bypasses using zero-compression and zero-padding (e.g., `0::1`, `0000:0000:0000:0000:0000:0000:0000:0001`).
**Learning:** `dns.promises.lookup()` and basic string checks do not normalize IPv6 addresses. Attackers can supply equivalent but visually distinct representations to bypass naive blocklists.
**Prevention:** Normalize IPv6 addresses explicitly using `new URL('http://[' + ip + ']').hostname.slice(1, -1)` before applying SSRF protection blocklists.
