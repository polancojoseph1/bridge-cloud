## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-05-19 - Improved Text Button Accessibility and Toggle States in Orchestration Component
**Learning:** Even buttons with visible text need clear focus indicators for keyboard users. Text-only action buttons ("All", "None") often lack `focus-visible` styling compared to main UI buttons. Toggle-style buttons (like `NodeChip`) should use `aria-pressed` to indicate their true selected state rather than just relying on visual style changes or checkmarks, so screen readers can convey their toggle nature accurately.
**Action:** When auditing custom UI components that act as filters or toggles, always ensure `aria-pressed` is used for the active state and verify that every interactive element has a visible focus ring, not just the primary ones.
