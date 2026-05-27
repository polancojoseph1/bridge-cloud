## 2026-05-27 - InstanceTabBar Rendering Optimization
**Learning:** While Zustand selectors are preferred for individual items, when rendering a list of items from a store array (like instances in InstanceTabBar), passing the full item object as a prop from the parent and wrapping the child in React.memo avoids the O(N^2) complexity where every child component independently performs an O(N) .find() lookup during every render cycle of the list.
**Action:** Use React.memo and pass the full object as a prop instead of an ID when rendering a list mapped from a store array.
