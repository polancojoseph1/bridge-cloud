## 2024-05-18 - Optimize InstanceTabBar re-renders
**Learning:** Using `useStore(s => s.items.find(...))` in mapped children of a global store list causes O(N^2) renders and an O(N) re-render cascade on unrelated state updates (like scroll flags).
**Action:** Pass full items and derived active/canClose state from the parent via props, and wrap list child components in `React.memo` to achieve O(N) render behavior.
