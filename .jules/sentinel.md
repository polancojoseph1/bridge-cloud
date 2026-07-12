## 2024-07-12 - Enforce HTTPS for External Server Connections
**Vulnerability:** The application allowed proxying requests and API keys to arbitrary external servers over unencrypted `http:` connections.
**Learning:** `http:` connections leave sensitive data, like authentication keys and conversation content, susceptible to Man-in-the-Middle (MitM) interception. While SSRF protections prevented connections to internal IPs, it didn't safeguard external communication.
**Prevention:** Strictly enforce `https:` protocols for any outbound connection that transmits sensitive data. Bypass this check *only* for specific local environments required for integration testing.
