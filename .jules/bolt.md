## 2024-07-15 - React.memo for Scroll Handlers
**Learning:** In scrollable list components where the parent component stores scroll state (like `canScrollLeft` / `canScrollRight`), failing to wrap mapped child list items in `React.memo()` causes an O(N) cascade of re-renders across all children for every tick of the scroll event.
**Action:** Always verify that child list items inside scroll-managed containers are memoized.
