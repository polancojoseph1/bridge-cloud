## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-10-22 - Add keyboard focus states to instance picker
**Learning:** Found that custom dropdown items and icon-only buttons often miss  styles, rendering them invisible to keyboard-only users.
**Action:** Always verify that interactive elements within custom popovers and tab bars receive distinct  utility classes (e.g. `focus-visible:ring-2`) for accessibility.
## 2024-10-21 - Add keyboard focus states to instance picker
**Learning:** Found that custom dropdown items and icon-only buttons often miss focus-visible styles, rendering them invisible to keyboard-only users.
**Action:** Always verify that interactive elements within custom popovers and tab bars receive distinct focus-visible utility classes for accessibility.
