## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-05-14 - Dynamic Tooltips for Action Buttons
**Learning:** Providing explicit tooltips for disabled states (e.g., "Enter a message to send") and including keyboard shortcuts for enabled states (e.g., "Send message (Enter)") greatly improves user understanding and accessibility.
**Action:** Always provide dynamic `title` attributes on primary action/submit buttons that explain the disabled reason when disabled, and show the keyboard shortcut when enabled.
