## 2024-10-25 - Targeted Zustand Selectors
**Learning:** Never subscribe to store getter methods directly in React components (e.g., `useStore(s => s.getterMethod)()`). This subscribes to the stable function reference, breaking reactivity and causing stale UI.
**Action:** Compute and select the required state directly within the selector function (e.g., `useStore(s => s.items.find(i => i.id === s.activeId))`).
