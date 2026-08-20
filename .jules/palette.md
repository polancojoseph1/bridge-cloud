## 2026-08-20 - Inline Delete Confirmation
**Learning:** Users can easily misclick destructive actions in dense list items. An inline two-step confirmation (Trash -> Check) prevents accidental deletions without the disruptive context switch of a modal dialog.
**Action:** For destructive actions within dense lists, implement a stateful two-step inline confirmation that resets on timeout or mouse leave.
