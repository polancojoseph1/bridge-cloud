## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2026-10-27 - Inline Deletion Confirmation
**Learning:** Destructive actions in dense lists like a sidebar conversation history should use an inline two-step confirmation (e.g., swapping to a check icon and changing color) instead of an interruptive modal dialogue to keep users in context.
**Action:** When implementing deletion features in a dense list, add a small 3s timeout check and swap icons as a confirmation pattern.
