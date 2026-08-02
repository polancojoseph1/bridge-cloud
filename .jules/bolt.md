## 2024-05-18 - Prevent O(N) re-renders in scrollable instances list
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), all mapped child list items will re-render on every scroll interaction if not memoized.
**Action:** Always wrap mapped child list items in `React.memo()` when the parent component manages local scroll state.
