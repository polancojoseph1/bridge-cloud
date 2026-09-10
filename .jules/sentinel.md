## 2024-03-20 - Fix SSRF bypass via IPv6 zero-padding
**Vulnerability:** The SSRF protection in isForbiddenHostname used strict string equality to check IPv6 addresses, which allowed bypassing the filter using zero-padding or zero-compression.
**Learning:** Always normalize IPv6 addresses before validation to ensure consistent representation.
**Prevention:** Use the built-in URL class to parse and normalize the IPv6 address hostname.
