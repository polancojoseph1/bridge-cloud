## 2026-08-10 - Optimize scrollable lists with React.memo()
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), every scroll interaction triggers a re-render of the parent. If child list items are not memoized, this causes a cascading O(N) re-render of all items in the list.
**Action:** Always wrap the mapped child list items in `React.memo()` in scrollable list components to change the O(N) render cascade into O(1).
