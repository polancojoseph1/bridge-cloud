## $(date +%Y-%m-%d) - Prevent Unnecessary Re-renders via Selectors
**Learning:** Object destructuring when calling Zustand hooks (e.g., `const { a, b } = useStore()`) causes unnecessary re-renders when *any* part of the global state changes because it subscribes to the entire store state.
**Action:** Always use individual, targeted selector functions to consume Zustand state (e.g., `const a = useStore(s => s.a)`), especially in UI components that are frequently active.
