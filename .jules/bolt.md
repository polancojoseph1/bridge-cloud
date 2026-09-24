## 2025-02-12 - Prevent Zustand Global Subscriptions
**Learning:** Destructuring multiple properties from a Zustand store hook (e.g., `const { a, b } = useStore()`) creates a global subscription, causing the component to re-render whenever *any* state in the store changes, even if the destructured properties haven't changed.
**Action:** Always use individual targeted selectors (e.g., `const a = useStore(s => s.a); const b = useStore(s => s.b);`) to ensure the component only re-renders when the specific properties it depends on change.
