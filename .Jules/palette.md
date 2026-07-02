## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-07-02 - Delete Conversation Confirmation
**Learning:** For destructive actions in dense lists (like deleting a chat), a modal dialog interrupts the user flow too much. However, immediate deletion without confirmation can lead to accidental data loss.
**Action:** Use an inline two-step confirmation (e.g., clicking a trash icon changes it to a checkmark requiring a second click) over modal dialogs to prevent flow interruption. Ensure the confirmation state resets on a timeout or when the user's mouse leaves the element.
