## 2024-08-14 - Memoize Scrollable Tabs
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), failing to wrap mapped child items in `React.memo()` causes an O(N) re-render cascade across the entire list whenever a user simply scrolls.
**Action:** Always wrap child list items in `React.memo()` when the parent manages scroll boundaries or other localized UI state to convert the O(N) render cascade into an O(1) operation.
