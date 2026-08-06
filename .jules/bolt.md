## 2024-05-18 - Prevent massive over-rendering in Zustand
**Learning:** Never use object destructuring to pull multiple properties from a Zustand store (e.g., `const { a, b } = useStore()`). This automatically subscribes the component to the ENTIRE store, causing massive over-rendering whenever unrelated state changes.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`).
