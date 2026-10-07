## 2026-10-07 - Memoize AgentRow in ProviderSelector
**Learning:** ProviderSelector maps child AgentRow components using inline arrow functions. During background updates (like polling via useAgentHealth), these inline functions defeat React's default optimizations and cause O(N) re-render cascades across all list items.
**Action:** Always wrap mapped child list items in React.memo() and pass primitive identifiers (e.g., id) to their handlers, providing stable function references via useCallback from the parent to prevent unnecessary re-renders.
