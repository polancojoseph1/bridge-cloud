## 2026-10-02 - Add tooltip explaining disabled button state
**Learning:** Consolidating tooltip logic for disabled buttons improves both developer experience (prevents duplicate JSX attributes) and accessibility/UX, by explicitly explaining to the user why an action is unavailable (e.g., "Enter a message to send" instead of just a dead button).
**Action:** Always provide descriptive `title` or `aria-label` fallback strings for disabled interactive elements to offer helpful guidance to the user.
