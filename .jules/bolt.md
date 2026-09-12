## 2024-06-25 - React Zustand Re-render Optimization
**Learning:** Destructuring multiple properties from a Zustand store (e.g., `const { a, b } = useStore()`) creates a global subscription, causing the component to re-render whenever any state in the store changes, even unrelated ones like background polling statuses.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`) to avoid unnecessary O(1) component re-renders.
