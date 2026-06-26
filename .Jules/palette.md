## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-06-26 - Inline Two-Step Confirmation
**Learning:** Modal confirmation dialogs for destructive actions (like deleting a chat) interrupt flow and are often excessive for low-stakes actions in dense lists. Inline two-step confirmation (clicking once to prime, again to confirm) provides safety without breaking context.
**Action:** Use inline two-step confirmation for destructive actions in list items. Reset the confirmation state on a timeout or when the user's mouse leaves the element.
