## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-10-24 - Disabled Button Tooltips
**Learning:** Interactive elements like buttons that are disabled due to missing input should provide contextual `title` attributes to explain why they are disabled.
**Action:** Always provide a `title` describing the unfulfilled requirement on disabled buttons, rather than leaving the user to guess.
