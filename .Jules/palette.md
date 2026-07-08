## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-07-08 - Inline Two-Step Confirmation for Dense Lists
**Learning:** Modal dialogs for destructive actions in dense lists (like a conversation sidebar) cause jarring flow interruptions.
**Action:** Implement inline two-step confirmation (e.g. Trash icon changes to Checkmark). Ensure the state automatically resets when the mouse leaves or after a timeout to prevent accidental deletions and gracefully handle user hesitation.
