## 2024-09-06 - Refactor Zustand Store Destructuring in Components
**Learning:** In Zustand, using global destructuring like `const { a, b } = useStore()` causes the component to subscribe to the entire store state. This leads to unnecessary re-renders whenever any unrelated state in the store changes.
**Action:** Always use individual, targeted selectors like `const a = useStore(s => s.a);` for each state slice needed by the component to optimize rendering performance.
