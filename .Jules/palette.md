## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-11-08 - Dynamic Send Button Tooltips and Post-Submission Focus
**Learning:** Hardcoded "Send message" titles on chat inputs don't explain why a button is disabled, leading to confusion, and failing to refocus the input after a message disrupts the user's flow. Duplicate attributes also cause build warnings or errors in React.
**Action:** Always provide dynamic `title` tooltips explaining disabled states (e.g. "Enter a message to send") and shortcuts (e.g. "Send message (Enter)"). Programmatically re-focus the input field using `setTimeout` after submission. When resolving duplicate attributes, ensure dynamic state text overrides fallbacks properly.
