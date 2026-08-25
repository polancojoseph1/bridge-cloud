## 2024-03-24 - Memoize list items in frequent update containers
**Learning:** In components with frequent background updates (like health polling in ProviderSelector), mapping unmemoized child components causes large O(N) re-render cascades.
**Action:** Always wrap mapped child components in `React.memo` when the parent container relies on polling or frequent global state updates, ensuring O(1) render cost per list item.
