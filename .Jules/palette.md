## 2026-04-25 - Focus Rings on Native Buttons
**Learning:** Native `<button>` elements in custom modals and gate components often lose their default browser focus indicators due to application-level CSS resets or heavy custom styling. This prevents keyboard-only users from identifying which element has focus.
**Action:** When implementing custom modals or styled buttons, always explicitly add `focus-visible:ring-2` (and corresponding `focus-visible:outline-none`) utilities to ensure consistent and accessible keyboard navigation.

## 2024-05-03 - Auto-focus chat inputs for immediate typing
**Learning:** Chat interfaces rely heavily on immediate keyboard access. Users expect to start typing immediately upon navigating to a chat or creating a new one. Without auto-focus, users have to manually click the input, causing friction.
**Action:** Always add `autoFocus` to primary text inputs in chat interfaces and empty states to enable instant keyboard interaction.
