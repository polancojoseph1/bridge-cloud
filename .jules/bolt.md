## 2024-07-11 - Zustand Getter Subscription Anti-Pattern
**Learning:** Subscribing to store getter methods directly in React components (e.g., `const item = useStore(s => s.getterMethod)()`) completely defeats reactivity because the component subscribes to the stable function reference instead of the underlying data. This causes stale UI that doesn't update when the data changes.
**Action:** Always compute and select the required state directly within the selector function (e.g., `useStore(s => s.items.find(i => i.id === s.activeId))`).
