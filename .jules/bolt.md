## 2024-06-25 - Memoize AgentRow in ProviderSelector
**Learning:** When using React.memo(), inline arrow functions passed to component props completely defeat the shallow comparison check, causing the component to re-render regardless. This was observed in `ProviderSelector` where `AgentRow` was receiving an inline `onSelect` wrapper.
**Action:** Always refactor child components to accept raw IDs and use stable `useCallback` function references from the parent when trying to apply memoization to mapped arrays in React.
