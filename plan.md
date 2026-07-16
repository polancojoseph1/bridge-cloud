1. **Optimize `InstanceTabBar` to prevent O(N^2) renders and scroll-induced re-renders.**
   - In `src/components/instance/InstanceTabBar.tsx`, import `memo` from `react`.
   - Modify `InstanceTab` to accept `instance`, `isActive`, and `canClose` as props, rather than querying `useInstanceStore` for them individually. Wrap it in `memo()`.
   - Modify `MobileInstancePill` to accept `instance`, `isActive`, and `canClose` as props similarly, and wrap it in `memo()`.
   - Update the mapping functions in `InstanceTabBar` to pass `instance`, `isActive`, and `canClose` to these child components.
   - *Performance Impact:* Changes rendering of child tabs from O(N^2) to O(N) when global state changes, and prevents the O(N) render cascade across all tabs when scrolling triggers state updates for `canScrollLeft` / `canScrollRight`.
2. **Log optimization learning.**
   - Document the performance learning regarding `useStore` arrays and `React.memo` for scrollable list components in `.jules/bolt.md`.
3. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
