## 2024-09-03 - Avoid Object Destructuring with Zustand Stores
**Learning:** Destructuring properties from a Zustand store hook (e.g., `const { a, b } = useStore()`) implicitly subscribes the component to the entire store state. This causes unnecessary re-renders whenever ANY property in the store changes, leading to CPU overhead, especially during frequent global state updates.
**Action:** Always use targeted selector functions (e.g., `const a = useStore(s => s.a)`) to extract values from Zustand stores to ensure the component only re-renders when its specific dependencies change.
