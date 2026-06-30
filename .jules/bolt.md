## 2024-05-24 - O(N*M) nested array lookups
**Learning:** Nested array lookups inside useMemo hooks (e.g. `.find()` inside a `.reduce()`) cause O(N*M) complexity, leading to unnecessary CPU overhead.
**Action:** Pre-compute a `Map` or `Set` outside the loop to achieve O(1) lookups during array traversal, reducing overall complexity to O(N).
