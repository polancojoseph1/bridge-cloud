## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## $(date +%Y-%m-%d) - Interactive Element Accessibility
**Learning:** Even buttons with visible text benefit from explicit `aria-label` and `title` attributes for improved screen reader context and native browser tooltips.
**Action:** When creating text-based interactive elements, evaluate if adding `aria-label` and `title` would enhance context for assistive technologies.
