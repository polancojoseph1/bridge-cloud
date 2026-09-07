## 2024-05-15 - React Zustand Multi-Select Pattern
**Learning:** Destructuring multiple properties directly from `useStore()` (e.g. `const { a, b } = useStore()`) creates a global subscription. When the global store updates, it causes the component to re-render, even if the extracted values didn't change.
**Action:** Extract properties directly with targeted selectors in individual variables, or use shallow comparison with `useShallow` for extracting multiple state properties.
