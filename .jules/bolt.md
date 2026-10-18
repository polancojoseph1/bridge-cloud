## 2026-10-18 - Memoize list items with stable callbacks in polling components
**Learning:** In parent components that frequently re-render due to background polling (like useAgentHealth), passing inline arrow functions to mapped child list items defeats React.memo() and causes O(N) re-render cascades.
**Action:** Always wrap mapped child list items in React.memo(), and pass stable function references via useCallback from the parent along with primitive identifiers (e.g., id) to handlers.
