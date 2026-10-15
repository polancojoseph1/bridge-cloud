## 2026-10-15 - Memoizing List Items with Polling Hooks
**Learning:** In parent components that frequently re-render due to background polling (e.g., useAgentHealth), rendering mapped child list items without React.memo and stable callbacks causes massive O(N) re-render cascades on every tick, even if the data hasn't changed.
**Action:** Always wrap mapped child list items in React.memo() and pass primitive identifiers to their handlers (with stable references via useCallback from the parent) when the parent component has high-frequency background updates.
