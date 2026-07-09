## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-05-15 - Inline Delete Confirmation Auto-Reset
**Learning:** For destructive actions in dense lists (like deleting a server profile), inline two-step confirmations provide a better UX than modals. However, if they don't automatically reset when the user moves away, they can lead to stuck UI states.
**Action:** When implementing inline confirmations, ensure the confirmation state resets automatically when the user's mouse leaves the element (`onMouseLeave`) or on a timeout.
