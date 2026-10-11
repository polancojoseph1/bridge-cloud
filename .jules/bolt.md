## 2026-10-11 - ProviderSelector UI Optimization
**Learning:** In React, hooks like useAgentHealth that map and return a fresh array on every render will completely defeat downstream useMemo blocks in consumers like ProviderSelector, causing unnecessary O(N) array reduction cascades on every health poll tick.
**Action:** Always wrap hook return values in useMemo (e.g., `useMemo(() => array.map(...), [deps])`) if the array objects aren't primitively stable, and always memoize mapped list item components like `<AgentRow />` using `React.memo` with stable `useCallback` prop references.
