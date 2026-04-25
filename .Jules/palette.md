## 2026-04-25 - Focus Rings on Native Buttons
**Learning:** Native `<button>` elements in custom modals and gate components often lose their default browser focus indicators due to application-level CSS resets or heavy custom styling. This prevents keyboard-only users from identifying which element has focus.
**Action:** When implementing custom modals or styled buttons, always explicitly add `focus-visible:ring-2` (and corresponding `focus-visible:outline-none`) utilities to ensure consistent and accessible keyboard navigation.
