## 2025-05-18 - Fix SSRF Bypass via Normalized IPv4-Compatible IPv6 Addresses
**Vulnerability:** The SSRF filter bypassed checks for IPv4-compatible IPv6 addresses (`::127.0.0.1`), which Node.js normalizes into hex representations (`::7f00:1`).
**Learning:** Node.js's built-in `URL` module normalizes IPv4-compatible IPv6 addresses into pure hex. Standard IPv4 blocklists must explicitly parse or match these normalized hex forms to prevent internal subnets bypasses.
**Prevention:** Implement a parser `parseIPv6ToIPv4` to detect and translate `::` prefixed hex representations back to 4-octet arrays, allowing standard IPv4 validations to process them properly.
