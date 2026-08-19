## 2024-08-19 - Add React.memo() to prevent scroll-induced render cascades
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), mapping unmemoized child list items causes the entire list to cascade re-render on every scroll interaction.
**Action:** Always wrap child list items mapped inside a scrollable container in `React.memo()` if the parent manages scroll state, changing an O(N) render cascade into O(1).
