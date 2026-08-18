## 2025-01-20 - Adding two-step confirmation for destructive actions
**Learning:** In dense list views, replacing the icon for a two-step inline confirmation is more usable than triggering a modal which blocks flow.
**Action:** Always prefer inline confirmation UI and handle `setTimeout` carefully to ensure it resets on mouseleave or a timeout.
