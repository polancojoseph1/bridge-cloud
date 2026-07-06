## 2024-07-06 - Optimize O(N^2) Zustand Array Lookup Re-renders
**Learning:** In a list of items rendered from a Zustand array store, having each child component independently call `useStore(s => s.items.find(...))` creates O(N^2) time complexity and causes O(N) re-renders every time any global state changes.
**Action:** Instead, map over the array in the parent component and pass the item object and computed properties (like `isActive`) directly as props. Wrap the child component in `React.memo` to achieve O(N) mapping with O(1) rendering cost per child.
