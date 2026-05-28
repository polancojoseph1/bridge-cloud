## 2024-05-28 - Avoid O(N^2) list rendering in Zustand
**Learning:** Rendering a list of items where each child component independently does an O(N) lookup (`instances.find(...)`) within a Zustand store array creates an O(N^2) complexity bottleneck.
**Action:** Pass the full item object as a prop from the parent and wrap the child component in `React.memo` to eliminate the N^2 lookups and unnecessary re-renders.
