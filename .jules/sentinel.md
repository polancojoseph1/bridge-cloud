## 2026-08-30 - IPv6 SSRF Bypass Fix
**Vulnerability:** The SSRF protection logic in `isForbiddenHostname` failed to block alternative IPv6 loopback formats, such as `0000:0000:0000:0000:0000:0000:0000:0001`, because it used strict string equality against `::1`.
**Learning:** Checking against exact representations of IPv6 addresses is prone to evasion via zero-padding and mixed formatting. Address standardization must be performed prior to matching.
**Prevention:** Normalize IPv6 inputs via standard parsing (e.g., using the URL constructor's inherent normalization) prior to any security validation rules.
