## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-06-30 - Interactive Elements Accessible Labels
**Learning:** Components wrapping native `<button>` elements (such as `ServerSwitcherPopover` or `ServerGate`) frequently omit explicit `aria-label` attributes when they rely on surrounding context or icons for meaning.
**Action:** Always ensure any interactive element (like buttons for logging in, managing servers, or connecting a server) has a distinct `aria-label` providing an explicit accessible name when the button's visible text alone might not be descriptive enough or when wrapping icons without textual content.
