## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-04-20 - Dynamic Action Button Tooltips
**Learning:** Primary action/submit buttons need dynamic `title` tooltips that explicitly explain the disabled state (e.g., "Enter a message to send") and include keyboard shortcuts for the enabled state (e.g., "Send message (Enter)").
**Action:** When creating or modifying primary action buttons, implement dynamic logic to show state-specific tooltips instead of static text.
