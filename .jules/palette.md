## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-10-30 - Accessible Backdrop Overlays
**Learning:** Purely visual backdrop overlays (e.g., dimming backgrounds behind modals or sidebars) that include `onClick` handlers to dismiss the UI must also include `aria-hidden="true"` to prevent screen readers from announcing them as empty, interactive elements.
**Action:** When implementing clickable backdrop overlays, always ensure `aria-hidden="true"` is provided to keep them purely visual for screen readers.
