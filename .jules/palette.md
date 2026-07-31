## 2025-01-31 - Inline confirmation for destructive actions in dense lists
**Learning:** For destructive actions in dense lists (like deleting a chat or item), relying on modal dialogs interrupts the flow and causes friction.
**Action:** Implement an inline two-step confirmation (e.g., clicking a trash icon changes it to a checkmark requiring a second click) instead of modal dialogs to prevent flow interruption. Ensure the confirmation state resets automatically on a timeout or when the user's mouse leaves the element.
