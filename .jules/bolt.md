## 2026-10-03 - Memoize AgentRow in ProviderSelector
**Learning:** In deeply nested UI components that re-render frequently (e.g., due to global health polling or local UI toggles), un-memoized list items can cause massive O(N) re-render cascades. Inline arrow functions defeat React.memo().
**Action:** Always wrap mapped child components in React.memo() and pass stable callbacks (via useCallback) from the parent to prevent unnecessary child re-renders.
