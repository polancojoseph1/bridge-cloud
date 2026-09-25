## 2026-09-25 - Zustand Destructuring Performance Pattern
**Learning:** Object destructuring from Zustand stores (e.g., `const { a, b } = useStore()`) creates a global subscription, causing the component to re-render on *any* store change, not just changes to `a` or `b`.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`) for Zustand store values to prevent unnecessary, cascading re-renders across the application.
