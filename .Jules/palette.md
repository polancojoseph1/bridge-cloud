## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-07-01 - Two-step Confirmation for Destructive Actions in Chat UI
**Learning:** For destructive actions in dense lists (like deleting a chat from a sidebar or conversation list), immediate deletion via a single click can lead to accidental data loss. Using a modal dialog interrupts the user flow and feels too heavy for small list items. An inline two-step confirmation (clicking once changes the icon to a checkmark or warning, requiring a second click to execute, and resetting on mouse leave or timeout) provides a frictionless yet safe experience.
**Action:** When implementing delete buttons on list items (like `ConversationItem`), prefer an inline two-click confirmation pattern with a timeout reset rather than instant deletion or heavy modals.
