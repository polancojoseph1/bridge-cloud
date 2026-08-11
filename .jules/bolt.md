## 2024-08-11 - Replace destructured Zustand store hooks
**Learning:** Destructuring multiple properties from a Zustand store hook (e.g. `const { a, b } = useStore()`) implicitly subscribes the component to the ENTIRE store, causing it to unnecessarily re-render on *every* unrelated store state update.
**Action:** Use specific selector functions for each property required from a Zustand store (e.g. `const a = useStore(s => s.a)`), or use `useShallow` when selecting an array/object to avoid excessive renders.
