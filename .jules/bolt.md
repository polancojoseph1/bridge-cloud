## $(date +%Y-%m-%d) - Object Destructuring from Zustand Stores Causes Unnecessary Re-renders
**Learning:** Destructuring multiple properties directly from a Zustand store (e.g., `const { a, b } = useStore()`) creates a global subscription. This means any state change in the store will cause the component to re-render, even if the changed property isn't being used by the component.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`) to prevent O(N) re-render cascades during frequent state updates.
