## 2025-02-14 - Prevent O(N) re-renders in scrollable list components
**Learning:** When a parent component stores scroll state (like `canScrollLeft`), it triggers a re-render of all its mapped child list items on every scroll interaction.
**Action:** Always wrap mapped child list items in `React.memo()` when the parent manages scroll state, changing an O(N) render cascade into O(1).
