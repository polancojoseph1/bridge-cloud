## 2024-05-24 - O(N*M) Lookup in useMemo
**Learning:** In React `useMemo` hooks, avoid nested loops (e.g. mapping over one array and finding items in another `O(N*M)`).
**Action:** Pre-compute an `O(1)` lookup `Map` or `Record` first, reducing total complexity to `O(N+M)`.
