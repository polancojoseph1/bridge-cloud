## 2026-08-01 - Prevent O(N) Re-renders in InstanceTabBar
**Learning:** Scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`) must wrap the mapped child list items in `React.memo()`. Otherwise, mapping children without memo causes O(N) cascading re-renders on every scroll interaction, slowing down the app.
**Action:** In scrollable list components where the parent component stores scroll state, always wrap the mapped child list items in `React.memo()`.
