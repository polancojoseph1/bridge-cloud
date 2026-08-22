## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-04-20 - Inline Delete Confirmation
**Learning:** Users can accidentally delete items in dense lists if there's no confirmation, but modal dialogs interrupt their workflow.
**Action:** Use inline two-step confirmation for destructive actions in lists (e.g., clicking Trash changes it to Check) with automatic reset on timeout or mouse leave.
