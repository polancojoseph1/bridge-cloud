## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-10-22 - Backdrop Overlay Accessibility
**Learning:** Purely visual background overlays (like the dark scrims behind modals or sidebars) that include `onClick` handlers to close the UI are often incorrectly announced by screen readers as empty, interactive buttons if they lack proper ARIA attributes.
**Action:** Always add `aria-hidden="true"` (and potentially `tabIndex={-1}`) to these structural backdrop `div`s to ensure screen readers ignore them and focus remains trapped within the actual modal content.
