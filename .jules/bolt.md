## 2024-07-27 - [Zustand Destructuring Anti-pattern]
**Learning:** Destructuring multiple properties from a Zustand store (e.g., `const { a, b } = useStore()`) automatically subscribes the component to the ENTIRE store, causing massive over-rendering whenever unrelated state changes.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`).
