## 2024-05-27 - [HIGH] Add .internal to SSRF Blocklist
**Vulnerability:** The SSRF protection (`isForbiddenHostname`) failed to block the `.internal` top-level domain.
**Learning:** The `.internal` domain is commonly used in private networks and cloud environments (like AWS) to access internal services and metadata. Relying only on IP blocklists or `.local` is insufficient defense-in-depth against SSRF.
**Prevention:** Always include `.internal` and other common internal TLDs alongside `.local`, `.localhost`, and private IP ranges in SSRF mitigation strategies.
