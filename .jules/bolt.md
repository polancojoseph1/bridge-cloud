## 2025-02-09 - [Memoize list items in scrollable containers]
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft`), mapped child list items should be wrapped in `React.memo()`. Without this, the entire list cascades re-renders on every scroll interaction, which is O(N).
**Action:** Always wrap list items in `React.memo()` when the parent manages frequent state updates like scroll positions.
