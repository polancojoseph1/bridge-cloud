## 2026-09-01 - Zustand Destructuring Re-render Bug
**Learning:** Using object destructuring on a Zustand store (e.g., const { a, b } = useStore()) creates a global subscription. This causes the component to re-render whenever ANY state in the store changes, rather than just the properties being used.
**Action:** Always use individual, targeted selectors (e.g., const a = useStore(s => s.a)) for Zustand stores to prevent unnecessary component re-renders.
