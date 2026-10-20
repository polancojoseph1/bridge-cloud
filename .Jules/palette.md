## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## $(date +%Y-%m-%d) - Improve disabled button states
**Learning:** Disabled elements should explain *why* they are disabled. Users often get confused when a primary action (like a "Send" button) is inexplicably unclickable. Providing a native `title` attribute with a brief explanation (e.g., "Enter a message to send") improves accessibility and reduces friction.
**Action:** Always provide a descriptive `title` or `aria-label` fallback string for disabled interactive elements to explain to the user why the action is currently unavailable.
