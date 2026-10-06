## 2026-10-06 - Prevent React Renders via Zustand Object Destructuring
**Learning:** Destructuring multiple properties from a Zustand store (e.g., const { a, b } = useStore()) subscribes the component to the entire store state. This anti-pattern causes the component to re-render whenever ANY value in the store changes, rather than just the properties it cares about.
**Action:** Always use individual, targeted selectors (e.g., const a = useStore(s => s.a)) or use `useStoreWithEqualityFn` with shallow equality for multiple properties to ensure minimal re-renders.
