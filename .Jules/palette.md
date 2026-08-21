## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-05-24 - Inline Delete Confirmation
**Learning:** Destructive actions in dense lists like sidebar conversations benefit from inline two-step confirmation (Trash -> Check) rather than modal dialogs which interrupt flow. The confirmation state resets automatically on a timeout or when the user's mouse leaves the element.
**Action:** Prefer inline two-step confirmation over modals for dense list items to prevent flow interruption.
