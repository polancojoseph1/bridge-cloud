## 2024-09-28 - Optimize ProviderSelector AgentRow

**Learning:** When creating large lists in React that subscribe to background poller hooks (like `useAgentHealth` polling every 30s), a parent's local state changes (e.g. `setOpen`) will trigger re-renders cascading down to all child list items.

**Action:** Wrap child list components (like `AgentRow`) in `React.memo()`. However, `React.memo()` is defeated by unstable inline callback props. Ensure the parent component uses `useCallback` to create stable function references for callbacks (like `onSelect`), and pass primitive IDs directly to the child's click handler rather than defining arrow functions inline during the map iteration.
