## 2025-02-20 - Inline 2-step confirmation
**Learning:** Using modal dialogs for destructive actions in dense lists (like chats) interrupts user flow. An inline two-step confirmation (Trash icon changes to Check on first click, resets on timeout or mouse leave) is less intrusive and preserves context.
**Action:** Always prefer inline state-based confirmations for destructive actions in tight list UI components over disruptive overlays.
