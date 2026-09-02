## $(date +%Y-%m-%d) - Zustand Object Destructuring Anti-pattern
**Learning:** Destructuring multiple properties from a Zustand store hook (e.g. `const { a, b } = useStore()`) creates a global subscription. This causes the component to re-render whenever ANY state in the store changes, rather than only when `a` or `b` change.
**Action:** Always use individual, targeted selectors (e.g. `const a = useStore(s => s.a)`) or `useShallow` when pulling multiple values from a Zustand store to prevent unnecessary O(N) re-render cascades in React.
