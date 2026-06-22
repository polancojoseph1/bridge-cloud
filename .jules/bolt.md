## 2024-06-22 - Prevent O(N*M) time complexity inside React useMemo loops
**Learning:** Nested array lookups (e.g., using `.find()` inside a `.reduce()` loop) inside `useMemo` or render cycles cause O(N*M) time complexity, creating significant performance bottlenecks during frequent re-renders.
**Action:** Always pre-compute a `Set` or `Map` before the loop to achieve O(1) lookups during array traversal, reducing overall complexity to O(N).
