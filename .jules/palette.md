## 2024-08-10 - Inline confirmation for destructive actions in dense lists
**Learning:** Modal dialogs for destructive actions in dense lists like chat histories can break user flow. Instead, inline two-step confirmations (like swapping an icon to a checkmark) provide a smoother experience while preventing accidental clicks. Auto-resetting on timeout or mouse leave is critical for it to feel robust.
**Action:** Use inline two-step confirmations over modals for simple list item deletions.
