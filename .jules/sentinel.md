## 2026-03-26 - [MEDIUM] Fix Information Disclosure in API proxy
**Vulnerability:** The `POST /api/proxy` endpoint returned raw upstream error bodies and statuses to the frontend, which could leak internal metadata or stack traces from the target server.
**Learning:** The proxy route blindly forwarded upstream responses on failure.
**Prevention:** API proxy handlers should intercept failed responses and map them to standardized, sanitized JSON errors with safe HTTP status codes like 502 Bad Gateway.
