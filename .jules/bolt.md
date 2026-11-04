## 2024-11-04 - O(N*M) to O(N+M) with Map Lookups
**Learning:** When calculating derived state inside `useMemo` that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find`), it causes O(N*M) nested loops.
**Action:** Pre-compute an O(1) lookup Map or Record first, reducing total complexity to O(N+M).
