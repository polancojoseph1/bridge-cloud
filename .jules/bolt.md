## 2024-05-24 - React Scroll Rendering Pattern
**Learning:** When a scrollable list component's parent stores scroll state (e.g., `canScrollLeft`, `canScrollRight`), all child list items will re-render whenever the user scrolls. This causes an O(N) cascade, leading to severe performance issues on long lists.
**Action:** Always wrap the mapped child list items in `React.memo()` in scrollable list components where the parent manages scroll state, changing the render cascade into O(1).
