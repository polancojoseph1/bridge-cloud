## 2024-05-18 - Memoize list items in polling components
**Learning:** Wrapping list items in `React.memo()` prevents O(N) re-renders when parent components update frequently due to background polling.
**Action:** Use `React.memo()` and pass stable `useCallback` references from parents to list items to avoid cascading re-renders on every poll interval.
