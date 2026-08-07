## 2024-05-24 - O(1) Scroll State Renders
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft`), mapped child items re-render constantly.
**Action:** Always wrap the mapped child list items in `React.memo()` to prevent cascading re-renders, changing an O(N) cascade into O(1).
