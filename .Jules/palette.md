## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2026-10-22 - Improve accessibility in orchestration NodeTray
**Learning:** Icon-only and text-only buttons in complex, dynamic component groups (like node selection trays) often lack necessary context for screen readers and miss focus-visible outlines needed for keyboard navigation.
**Action:** When creating grouped selection interfaces, always verify every interactive element has both an `aria-label` for screen readers, a `title` for sighted users (tooltips), and explicit `focus-visible` styling.
