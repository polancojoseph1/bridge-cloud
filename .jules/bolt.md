## 2024-08-20 - Memoizing InstanceTabs in scrollable list
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), always wrap the mapped child list items in `React.memo()`. This prevents the entire list from cascading re-renders on every scroll interaction, changing an O(N) render cascade into O(1).
**Action:** Always check parent list components with scroll state and wrap the children list item components with `React.memo()`.
