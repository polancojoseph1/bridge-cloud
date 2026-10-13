## 2026-10-13 - Prevent O(N) Re-render Cascades from Polling Hooks
**Learning:** In parent components that frequently re-render due to background updates (like polling via useAgentHealth), mapped child list items without memoization cause large O(N) re-render cascades.
**Action:** Always wrap mapped child list items in React.memo(). To ensure memoization is effective, pass primitive identifiers (e.g., id) to their handlers instead of relying on inline arrow functions, and provide stable function references via useCallback from the parent.
