## 2024-06-19 - Inline two-step confirmation for destructive actions in dense lists
**Learning:** For destructive actions in dense lists (like deleting a chat or item), an inline two-step confirmation (e.g., clicking a trash icon changes it to a checkmark requiring a second click) is highly preferred over modal dialogs to prevent flow interruption.
**Action:** Implement inline two-step confirmations that automatically reset on timeout or mouse leave instead of generic confirmation modals for list items.
