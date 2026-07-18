## 2024-05-24 - Optimize list rendering with React.memo and passed props
**Learning:** Using `React.memo` and passing computed props to child elements inside mapped arrays from a Zustand store drastically reduces unnecessary O(N) component re-renders. Avoid having mapped children directly query the store via `useStore` with their item ID.
**Action:** Always wrap list child components in `React.memo` and pass pre-computed state down as props from the parent mapping function rather than having each child connect to the store independently.
