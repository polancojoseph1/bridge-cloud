## 2025-03-01 - List Rendering Optimization
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), always wrap the mapped child list items in `React.memo()`. This prevents the entire list from cascading re-renders on every scroll interaction, changing an O(N) render cascade into O(1).
**Action:** Apply React.memo() to list items inside scrollable containers that manage their own scroll position state.
