## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-10-24 - Backdrop Overlay Accessibility
**Learning:** Purely visual backdrop overlays that include `onClick` handlers to dismiss UI must include `aria-hidden="true"` to prevent screen readers from announcing them as empty, interactive elements.
**Action:** Always add `aria-hidden="true"` to backdrops or overlay `div`s that only serve as click targets for dismissal.
