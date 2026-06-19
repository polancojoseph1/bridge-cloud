## 2024-05-31 - Fix Information Disclosure in Error Messages
**Vulnerability:** Upstream fetch errors were directly passing `err.message` back to the client in `/api/proxy/verify` and `healthCheck.ts`.
**Learning:** Passing raw error messages to the client can leak internal network configuration, stack traces, or exact reasons for request failure.
**Prevention:** Always sanitize outbound errors to generic messages like "Network error" unless specifically intended for the end-user.
