## 2024-10-28 - Optimize array lookups in derived state
**Learning:** When calculating derived state inside `useMemo` that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find`), this creates `O(N*M)` nested loops.
**Action:** Pre-compute an `O(1)` lookup `Map` or `Record` first, reducing total complexity to `O(N+M)`.
