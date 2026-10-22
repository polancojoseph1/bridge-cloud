## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-10-22 - Keyboard Accessible Interactive Elements
**Learning:** Interactive non-button elements (like `div` or `span` with `onClick`) must be accessible to keyboard users. This requires adding `role="button"`, `tabIndex={0}`, an `onKeyDown` handler to trigger the action on 'Enter' or 'Space', and `focus-visible` styles for visual feedback.
**Action:** Always verify that custom interactive elements receive the same accessibility treatment as native `<button>` elements.
