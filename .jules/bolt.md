## 2024-05-18 - Avoid O(N^2) complexity in Zustand array rendering
**Learning:** When a parent component `.map()`s over an array from a Zustand store, and each child component independently calls `useStore(s => s.array.find(...))`, it creates O(N^2) time complexity and O(N) re-renders when global active state changes.
**Action:** Pass the full item object and computed state (like `isActive`) as props from the parent mapping function, and wrap the child components in `React.memo` to achieve O(N) rendering.
