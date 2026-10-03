## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-04-21 - Disabled Button Tooltips
**Learning:** For disabled interactive elements (like icon-only buttons), users may not understand why the action is unavailable without clear feedback.
**Action:** Always provide a descriptive `title` and `aria-label` fallback string (e.g., 'Enter a message to send' for a disabled send button) instead of repeating the default action label or leaving it empty.
