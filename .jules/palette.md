## 2025-02-14 - Visual Backdrop Overlays Accessibility
**Learning:** Purely visual backdrop overlays (e.g., behind modals or sidebars) that include `onClick` handlers to dismiss the UI must also include `aria-hidden="true"` to prevent screen readers from announcing them as empty, interactive elements.
**Action:** Always add `aria-hidden="true"` to structural UI backdrops with click handlers.
