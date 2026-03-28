## 2025-03-26 - [SSRF Bypass via Alternative IPv4 Formats]
**Vulnerability:** The `isForbiddenHostname` function in `src/lib/ssrf.ts` only blocked standard dotted-decimal internal IPs (e.g. `127.0.0.1`). Attackers could bypass this check by supplying alternate formats (octal `0177.0.0.1`, hex `0x7f.0.0.1`, or dword `2130706433`), which `new URL()` happily normalized and resolved to `127.0.0.1` after bypassing the filter.
**Learning:** Regexes matching standard dotted-decimal formats are fundamentally insufficient for SSRF protection because URL parsers natively support and convert multiple numeric representations of IP addresses.
**Prevention:** To prevent this, always parse numeric IP representations back into their base segments before applying blocklist logic.
## 2026-03-28 - [Hardcoded Secrets in Next.js Config]
**Vulnerability:** Live publishable keys and secret keys for Clerk authentication were hardcoded into the `next.config.ts` configuration file.
**Learning:** Developer configuration files like `next.config.ts` are often checked into source control, so storing fallback secrets directly inside the configuration variables makes them vulnerable to exposure and leakage.
**Prevention:** Ensure secrets or live publishable API keys are passed securely using `process.env` variables (e.g., from `.env.local`) and avoid assigning them hardcoded fallback strings in the repository files.
