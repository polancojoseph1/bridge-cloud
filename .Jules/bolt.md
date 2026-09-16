## 2023-09-16 - Zustand Destructuring Re-renders
**Learning:** Destructuring multiple properties from a Zustand store hook (`const { a, b } = useStore()`) creates a global subscription. This causes the component to needlessly re-render whenever ANY property in the store changes, even those not destructured.
**Action:** Always use individual, targeted selectors (`const a = useStore(s => s.a)`) to extract state from Zustand stores. This ensures the component only re-renders when the specifically selected state changes.
