## 2026-09-27 - Memoize AgentRow in ProviderSelector
**Learning:** In parent components that frequently re-render due to background updates (e.g., polling via useAgentHealth), mapped child list items should be wrapped in React.memo(). Passing primitive identifiers (like id) to handlers and providing stable function references via useCallback prevents large O(N) re-render cascades.
**Action:** When rendering lists of components in a polling or high-frequency update context, always use React.memo on the child and useCallback with primitive args in the parent.
