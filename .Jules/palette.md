## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-06-28 - Two-Step Confirmation for Delete Actions in Lists
**Learning:** Destructive actions in dense lists like sidebar chat histories can be easily misclicked. Standard modal dialogs interrupt the user flow too much, while no confirmation risks accidental data loss.
**Action:** Implemented an inline, two-step confirmation pattern where clicking a delete icon changes it to a confirm icon, requiring a second click. Added a timeout and `onMouseLeave` handler to automatically cancel the confirmation state, keeping the list UX fluid while remaining safe.
