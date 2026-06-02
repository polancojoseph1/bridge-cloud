## 2026-06-02 - Prevent Information Disclosure in Error Handling
**Vulnerability:** Raw exception messages (`err.message`) were passed directly to clients in `/api/proxy/verify` and `src/lib/healthCheck.ts`.
**Learning:** Exposing raw error details from caught exceptions or network failures can leak sensitive internal state or stack traces to end-users.
**Prevention:** Always sanitize outbound errors to generic messages like 'Network error' unless the specific error detail is explicitly intended and safe for the end-user.
