## 2026-07-26 - Prevent O(N) Render Cascades on Scroll
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), not memoizing child list items causes the entire list to cascade re-renders on every scroll interaction, which is an O(N) render cascade.
**Action:** Always wrap the mapped child list items in `React.memo()` to change this to O(1).
