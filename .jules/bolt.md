## 2024-08-21 - Scroll State Driven Re-render Cascade
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), the parent will re-render on every scroll event (if state updates). Without memoization on the mapped child list items, this changes an O(N) render cascade into O(N) for every single scroll interaction.
**Action:** Always wrap mapped child list items in `React.memo()` when the parent component manages scrolling state.
