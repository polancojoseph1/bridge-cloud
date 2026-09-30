## 2024-05-18 - Memoize mapped components in frequently polled parents
**Learning:** When a parent component like `ProviderSelector` frequently updates due to polling (e.g., via `useAgentHealth`), its mapped child components will continuously re-render.
**Action:** Use `React.memo()` on list items that are rendering mostly static data during these polling cycles to turn O(N) re-renders into O(1), and ensure parent components pass stable function references via `useCallback` when necessary.
