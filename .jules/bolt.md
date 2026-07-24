## 2024-07-24 - InstanceTabBar Re-renders
**Learning:** The `InstanceTabBar` parent component stores scroll state (`canScrollLeft`, `canScrollRight`), causing the entire component to re-render on scroll. Because the child components `InstanceTab` and `MobileInstancePill` were mapped in an array without memoization, every scroll event triggered an O(N) render cascade for all tabs.
**Action:** Always wrap mapped child list items in `React.memo()` inside scrollable list components where the parent manages scroll state.
