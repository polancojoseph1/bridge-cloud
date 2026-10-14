## 2026-10-14 - Memoize List Items During Background Updates
**Learning:** Components that frequently re-render due to background updates (like polling via useAgentHealth) cause O(N) re-render cascades if list items aren't memoized correctly. Inline arrow functions defeat React.memo().
**Action:** Always wrap mapped child list items in React.memo(), pass primitive identifiers to their handlers, and provide stable function references via useCallback from the parent to ensure memoization is effective.
