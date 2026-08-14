## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-08-14 - Inline Confirmation for Deletion
**Learning:** Using modal dialogs for deleting items in a dense list like a chat history interrupts the user's flow. An inline two-step confirmation (clicking a trash icon changes it to a checkmark requiring a second click) is much less disruptive and still prevents accidental deletions. The state should reset on a timeout or when the user's mouse leaves the item.
**Action:** Default to inline two-step confirmations for destructive actions on individual list items unless the action has severe, unrecoverable consequences requiring a more explicit block.
