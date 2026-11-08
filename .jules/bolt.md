## 2024-03-24 - Pre-compute Maps for Nested Array Operations
**Learning:** Calculating derived state inside useMemo that requires mapping or reducing over one array while looking up items in another (e.g., `nodes.find`) creates `O(N*M)` nested loops.
**Action:** Pre-compute an `O(1)` lookup Map or Record first, reducing total complexity to `O(N+M)`. This prevents CPU overhead during render cycles.
