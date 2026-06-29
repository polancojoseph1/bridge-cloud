## 2024-06-29 - O(N*M) nested array lookups in useMemo

**Learning:** Nested array lookups (e.g. `array.find()`) inside loops within React `useMemo` hooks cause O(N*M) time complexity and create performance bottlenecks.
**Action:** When filtering or counting properties of an array that depend on a secondary list of IDs, always pre-compute a `Map` (or `Set`) for O(1) lookups before entering the iteration loop, thereby reducing the complexity to O(N).
