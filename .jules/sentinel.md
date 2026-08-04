## 2024-11-20 - [SSRF IPv6 Bypass Prevention]
**Vulnerability:** The SSRF protection mechanism blocked loopback addresses like `::1` using strict string equality, allowing bypasses via zero-compression and zero-padding (e.g., `0::1`, `0000::1`).
**Learning:** Node.js `dns.lookup` does not normalize IPv6 strings before returning them, meaning SSRF validations must proactively normalize resolved IP addresses before comparison.
**Prevention:** Always parse and normalize IPv6 addresses (e.g., using `new URL('http://[' + ip + ']').hostname`) before applying blocklists.
