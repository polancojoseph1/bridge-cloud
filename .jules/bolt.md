## $(date +%Y-%m-%d) - Prevent O(N) cascades in scrollable lists
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), mapping child list items without `React.memo()` causes the entire list to cascade re-renders on every scroll interaction, changing an O(N) render cascade into O(1).
**Action:** Always wrap mapped child list items in `React.memo()` when the parent tracks scroll state.
