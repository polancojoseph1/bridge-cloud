## 2024-06-03 - Prevent Information Disclosure in Error Handlers
**Vulnerability:** Raw error messages (`err.message`) from caught exceptions (like `fetch` errors) were passed directly to the client response in API routes (`/api/proxy/verify`) and `healthCheck.ts`.
**Learning:** This can leak internal paths, IP addresses, or underlying Node.js mechanics to the end-user, creating an Information Disclosure vulnerability.
**Prevention:** Always sanitize outbound errors to generic messages like 'Network error' unless the specific error detail is explicitly intended for the end-user.
