
## 2024-05-15 - [Prevent List Re-renders on Scroll]
**Learning:** In a scrollable list component (`InstanceTabBar`), storing scroll state (`canScrollLeft`, `canScrollRight`) in the parent component causes the entire list to re-render on scroll.
**Action:** Always wrap the child list items (`InstanceTab`, `MobileInstancePill`) in `React.memo()` if the parent component updates state during scroll interactions, ensuring O(N) renders become O(1).
