## 2024-07-26 - Inline two-step confirmations for destructive actions
**Learning:** Users often misclick delete icons in dense lists, and traditional modal dialogs are too interruptive for common actions.
**Action:** Used an inline two-step confirmation (clicking a trash icon changes it to a checkmark requiring a second click) instead of modal dialogs. Ensure the confirmation state resets automatically on a timeout or when the user's mouse leaves the element.
