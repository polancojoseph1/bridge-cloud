## 2025-01-20 - Fix IPv6 SSRF Bypass in isForbiddenHostname
**Vulnerability:** The SSRF check for IPv6 loopback only blocked the exact string '::1', allowing equivalent IP formats (like '0::1' or '0000:0000:0000:0000:0000:0000:0000:0001') to bypass the filter and resolve to localhost.
**Learning:** String equality checks for IP addresses are insufficient due to the multiple valid string representations of the same IP address, especially in IPv6.
**Prevention:** Always normalize IP addresses or use a robust regex that matches all equivalent string representations of restricted IPs before performing validation.
