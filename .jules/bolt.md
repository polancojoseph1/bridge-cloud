## 2026-08-30 - Zustand Object Destructuring Re-render Penalty
**Learning:** Destructuring multiple properties from a Zustand store (e.g., const { a, b } = useStore()) creates a global subscription. When any other store property updates, this component re-renders unnecessarily, causing significant performance degradation in frequent-update scenarios.
**Action:** Always use individual, targeted selectors (e.g., const a = useStore(s => s.a)) to subscribe strictly to the needed properties and avoid O(N) rendering cascades.
