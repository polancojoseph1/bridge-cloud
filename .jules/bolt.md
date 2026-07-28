## 2024-07-28 - Prevent O(N) re-renders in scrollable lists
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), any scroll interaction triggers a state update and causes an O(N) render cascade for all child items.
**Action:** Always wrap the mapped child list items in `React.memo()` in such patterns to change the render cascade from O(N) to O(1).
