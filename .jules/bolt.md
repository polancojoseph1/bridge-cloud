## 2024-05-14 - Zustand Global Subscription Anti-Pattern
**Learning:** Avoid using object destructuring to extract multiple properties from a Zustand store (e.g., `const { a, b } = useStore()`), as it creates a global subscription leading to unnecessary re-renders when ANY store state changes.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`), or `useShallow` for multiple values, to prevent performance bottlenecks.
