## 2024-10-16 - Memoize AgentRow Component
**Learning:** In polling components like `ProviderSelector` where parent state (health checking) updates constantly, mapping over child lists without `React.memo` and stable handlers causes O(N) cascade re-renders across the list. Even primitive components can become a performance drag when polling triggers aggressive GC from array destruction/recreation.
**Action:** Always wrap mapped child items in `React.memo`, pass stable scalar values (IDs) instead of full objects to handlers, and use `useCallback` for parent event handlers.
