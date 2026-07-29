## 2024-05-24 - Prevent Zustand entire store subscription
**Learning:** Never use object destructuring to pull multiple properties from a Zustand store (e.g., `const { a, b } = useStore()`). This automatically subscribes the component to the ENTIRE store, causing massive over-rendering whenever unrelated state changes.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a); const b = useStore(s => s.b);`).
