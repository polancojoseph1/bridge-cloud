## 2024-05-23 - Prevent O(N^2) complexity with pre-computed Map inside useMemo loops
**Learning:** Found nested array lookups (e.g. `.find()`) inside a `.reduce()` loop within `useMemo`. This creates an O(N*M) time complexity when iterating through arrays.
**Action:** When mapping over items that require referencing a secondary list, pre-compute a `Map` (or `Set`) before the loop. This converts the O(N) array search into an O(1) hash map lookup, dropping total complexity from O(N*M) down to O(N).
