## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-04-20 - Focus Ring
**Learning:** Add focus-visible on the closest interactable elements to avoid large, misaligned focus rectangles around parent elements that capture clicks.
**Action:** Always check the exact clickable target that receives keyboard focus and apply `focus-visible` styles directly to it.
