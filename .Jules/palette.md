## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-07-22 - Two-Step Confirmation for Destructive Actions in Dense Lists
**Learning:** For destructive actions in dense lists (like deleting a chat), a modal confirmation interrupts the flow. A two-step inline confirmation (e.g., clicking a trash icon changes it to a checkmark requiring a second click) provides a smoother UX. It's important to reset the confirmation state on a timeout or when the user's mouse leaves the element.
**Action:** Prefer two-step inline confirmation over modals for destructive actions in dense lists.
