## 2024-06-21 - Replace nested O(N*M) finds with O(1) Map lookups in useMemo loops
**Learning:** Using `.find()` inside a `.reduce()` or `.map()` loop within React component `useMemo` hooks leads to `O(N*M)` execution time, slowing down renders.
**Action:** Always pre-compute a `Map` of objects by their IDs when iterating over an array of IDs to fetch the full objects, reducing the time complexity to `O(N+M)`.
