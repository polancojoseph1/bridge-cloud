## 2024-11-07 - Replace O(N*M) React re-render calculations with O(N+M) Map lookups
**Learning:** When calculating derived state inside `useMemo` that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find`), it introduces an `O(N*M)` nested loop bottleneck.
**Action:** Pre-compute an `O(1)` lookup `Map` or `Record` first, reducing total complexity to `O(N+M)`.
