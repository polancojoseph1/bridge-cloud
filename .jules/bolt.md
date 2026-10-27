## 2024-10-27 - Initializing Bolt Journal
**Learning:** Initializing the bolt journal for critical learnings.
**Action:** Always document critical learnings here in the correct format.

## 2024-10-27 - O(N*M) nested loops in derived state
**Learning:** When calculating derived state inside useMemo that requires reducing over one array while looking up items in another (e.g. nodes.find), it causes an O(N*M) time complexity.
**Action:** Pre-compute an O(1) lookup Map or Record first, reducing total complexity to O(N+M).
