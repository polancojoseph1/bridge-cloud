## 2024-10-26 - Optimize derived state array lookups
**Learning:** When calculating derived state inside `useMemo` that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find`), it causes `O(N*M)` nested loops which degrades performance with large lists.
**Action:** Avoid `O(N*M)` nested loops. Pre-compute an `O(1)` lookup `Map` or `Record` first inside `useMemo`, reducing total complexity to `O(N+M)`.
