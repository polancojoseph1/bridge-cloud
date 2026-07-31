## 2024-07-31 - Memoize scrollable list items
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), always wrap the mapped child list items in `React.memo()`. This prevents the entire list from cascading re-renders on every scroll interaction, changing an O(N) render cascade into O(1).
**Action:** Always wrap mapped child list items in `React.memo()` when the parent component stores scroll state or other frequently updated state.
