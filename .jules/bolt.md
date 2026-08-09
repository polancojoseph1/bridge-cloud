## 2026-08-09 - Prevent O(N) rendering cascades in scrollable lists
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), the entire list re-renders on every scroll interaction.
**Action:** Always wrap the mapped child list items in `React.memo()`. This changes an O(N) render cascade into O(1).
