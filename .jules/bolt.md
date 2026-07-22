## 2024-07-22 - Memoizing mapped children in scrollable list components
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), the mapped child list items must be wrapped in `React.memo()`. Without it, every single item in the list will needlessly re-render during smooth scrolling interactions when the parent's scroll state changes, causing layout thrashing and an O(N) render cascade.
**Action:** Always wrap list items in `React.memo()` when the parent component manages scrolling state.
