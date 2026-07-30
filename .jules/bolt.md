## 2026-07-30 - Prevent O(N) rendering in scrollable lists
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), always wrap the mapped child list items in `React.memo()`. This prevents the entire list from cascading re-renders on every scroll interaction, changing an O(N) render cascade into O(1).
**Action:** When implementing horizontally scrollable tab bars or lists that track their own scroll overflow state, immediately apply `memo` to the child elements.
