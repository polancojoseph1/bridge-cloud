## 2024-07-25 - Inline confirmation for destructive actions in dense lists
**Learning:** Modal dialogs for deleting items in a dense list (like a chat history sidebar) are too disruptive to the user's flow, but zero-confirmation leads to accidental data loss.
**Action:** Use an inline two-step confirmation pattern (Trash icon to Checkmark icon) that automatically resets via timeout or onMouseLeave to prevent accidental clicks while maintaining friction-less navigation.
