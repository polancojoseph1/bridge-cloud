## 2024-08-27 - Inline Confirmation for Destructive Actions
**Learning:** In dense lists like a conversation history, destructive actions (like delete) can be accidentally triggered, but modal dialogs create too much friction. An inline two-step confirmation (changing icon state on first click) is much smoother.
**Action:** Use inline state toggles (e.g., trash icon -> checkmark) with a timeout/mouseleave reset for deletion actions in tight UI spaces rather than intrusive modals.
