## 2024-03-24 - Inline Delete Confirmation
**Learning:** Destructive actions in dense lists like sidebar chats cause friction when interrupted by modal dialogs. Users accidentally click delete, but modal confirmation interrupts their flow.
**Action:** Use an inline two-step confirmation (Trash icon changes to Checkmark on first click, requiring a second click to delete) that automatically resets on timeout or mouse leave to keep the flow smooth and prevent accidental deletions.
