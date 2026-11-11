## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-11-11 - Dynamic Tooltips for Action Buttons
**Learning:** Providing dynamic `title` tooltips for primary action buttons that explicitly explain the disabled state and include keyboard shortcuts for the enabled state significantly improves UX and accessibility without adding visual noise.
**Action:** When implementing primary submit buttons, use dynamic `title` text to explain both disabled states (e.g., "Enter a message to send") and enabled shortcuts (e.g., "Send message (Enter)").
