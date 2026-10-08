## 2026-10-08 - Memoize AgentRow
**Learning:** Component list rendering causes cascading re-renders if list items accept inline functions as props, bypassing React's internal optimizations and unnecessarily mounting/unmounting DOM nodes.
**Action:** Use `React.memo` for mapped child components and pass stable function references via `useCallback` from the parent component instead of inline arrow functions.
