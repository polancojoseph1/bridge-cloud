## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-07-07 - Inline Two-Step Confirmation for Destructive Actions
**Learning:** For destructive actions in dense lists (like deleting a chat), inline two-step confirmation (e.g., trash icon changing to a checkmark) is preferred over modal dialogs to prevent flow interruption. The confirmation state must safely reset via a timeout or when the user's mouse leaves the element.
**Action:** Use inline two-step confirmation with timeout/mouseleave resets for all list-item destructive actions instead of heavy modals.
