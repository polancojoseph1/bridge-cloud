## 2024-05-18 - Zustand Object Destructuring Anti-pattern
**Learning:** Destructuring a Zustand store (`const { a, b } = useStore()`) implicitly subscribes the component to the ENTIRE store, causing massive over-rendering on any unrelated state change.
**Action:** Always use individual, targeted selectors (`const a = useStore(s => s.a)`) or `useShallow` when pulling multiple properties from Zustand.
