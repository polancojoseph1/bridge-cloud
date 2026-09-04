## 2024-05-28 - [Inadequate IPv6 SSRF Protection]
**Vulnerability:** The application attempts to block server-side request forgery (SSRF) to internal IPv6 addresses, but does so using strict string equality (e.g., `cleanHn === '::1'`). This fails to block zero-padded or fully expanded IPv6 representations of localhost, such as `0000:0000:0000:0000:0000:0000:0000:0001` or `[::0001]`.
**Learning:** Checking IPv6 addresses manually with strict equality or naive regex is extremely error-prone due to zero compression and zero-padding.
**Prevention:** Rely on standard URL parsing libraries (like Node.js' `new URL`) which normalize IPv6 addresses automatically, and check against the normalized output.
## 2024-05-28 - [Inadequate IPv6 SSRF Protection]
**Vulnerability:** The application attempts to block server-side request forgery (SSRF) to internal IPv6 addresses, but does so using strict string equality (e.g., `cleanHn === ::1`). This fails to block zero-padded or fully expanded IPv6 representations of localhost, such as `0000:0000:0000:0000:0000:0000:0000:0001` or `[::0001]`.
**Learning:** Checking IPv6 addresses manually with strict equality or naive regex is extremely error-prone due to zero compression and zero-padding.
**Prevention:** Rely on standard URL parsing libraries (like Node.js` new URL`) which normalize IPv6 addresses automatically, and check against the normalized output.
