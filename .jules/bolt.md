## 2024-11-20 - [Performance Optimization]
**Learning:** When calculating derived state inside `useMemo` that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find` inside a loop), it creates `O(N*M)` nested loops.
**Action:** Pre-compute an `O(1)` lookup `Map` or `Record` first, reducing total complexity to `O(N+M)`.
