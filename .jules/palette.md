## 2026-10-19 - Add descriptive tooltips to disabled interactive elements
**Learning:** Disabled buttons without dynamic text leave users guessing why the action is unavailable, causing frustration and accessibility gaps.
**Action:** Always provide a descriptive `title` or `aria-label` fallback string (e.g., 'Enter a message to send') when a button is conditionally disabled.
