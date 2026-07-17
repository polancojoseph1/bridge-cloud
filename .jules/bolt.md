## 2024-07-17 - Optimize ServerSwitcherPopover destructuring
**Learning:** Destructuring an entire Zustand store (e.g. `const { a, b } = useStore()`) implicitly subscribes the component to all state updates in the store, causing massive over-rendering.
**Action:** Always use targeted selectors (e.g. `const a = useStore(s => s.a)`) instead of object destructuring when consuming from Zustand stores.
