## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2026-10-22 - Add tooltips to disabled buttons
**Learning:** Users who rely on screen readers or native browser tooltips lack context on why an interactive element like a 'Send' button is disabled. Providing a fallback string (e.g., 'Enter a message to send') greatly improves accessibility and UX.
**Action:** Always supply a descriptive `title` and `aria-label` for disabled buttons explaining the reason for the disabled state.
