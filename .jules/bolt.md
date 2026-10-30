## 2024-10-30 - Replace O(N*M) nested array lookups with O(1) Maps in React components
**Learning:** When calculating derived state inside `useMemo` that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find`), it creates `O(N*M)` complexity which can lead to GC pauses and sluggish UI.
**Action:** Pre-compute an `O(1)` lookup `Map` or `Record` first, reducing total complexity to `O(N+M)`.
