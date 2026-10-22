## 2026-10-22 - Remove redundant aria-label on buttons with visible text
**Learning:** Found a pattern in this codebase where developers add `aria-label` and `title` to buttons that already have clear visible text (e.g. `NewChatButton`). This creates redundant verbosity for screen reader users on this specific app's sidebar.
**Action:** When adding new buttons to the Bridge Cloud sidebar, only use `aria-label` for icon-only buttons like the server switcher. Do not duplicate visible text in `aria-label` or `title`.
