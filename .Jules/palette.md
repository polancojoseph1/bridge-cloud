## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2026-10-09 - Disabled Button Tooltips
**Learning:** For disabled interactive elements (like buttons), always provide a descriptive `title` or `aria-label` fallback string to explain to the user why the action is currently unavailable.
**Action:** Always conditionally render `aria-label` and `title` based on the `disabled` state for buttons to provide helpful feedback when actions are disabled.
