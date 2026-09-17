## 2026-09-17 - Memoize AgentRow in ProviderSelector
**Learning:** Components that rely on frequent background updates (like `useAgentHealth` polling every 30s) will re-render their entire mapped children list on every poll.
**Action:** Always wrap mapped child components in `React.memo()`, pass primitive identifiers to handlers instead of using inline arrow functions, and provide stable function references via `useCallback` from the parent to prevent large O(N) re-render cascades.
