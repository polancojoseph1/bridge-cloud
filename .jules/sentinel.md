## YYYY-MM-DD - Markdown Link XSS Vulnerability
**Vulnerability:** The custom markdown link renderer (`a` tag in `src/components/chat/MarkdownRenderer.tsx`) used a regex `/^(https?|mailto):/i.test(href)` to validate URLs.
**Learning:** This regex failed to account for leading whitespace (e.g., ` javascript:alert(1)`). Since browsers often trim whitespace in `href` attributes, an attacker could bypass the `isSafe` check but the browser would still execute the XSS payload.
**Prevention:** Always `trim()` input *before* performing URL validation or regex checks. Ensure that the sanitized/trimmed value is the one actually rendered in the DOM, not just the one used for the check.
