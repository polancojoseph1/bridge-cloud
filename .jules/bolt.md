
## 2024-03-27 - [Array Filtering Optimization]
**Learning:** In frequently polling React components (like `ProviderSelector` handling health checks), replacing `const a = arr.filter(f1); const b = arr.filter(f2);` with a single `.reduce` pass to partition the arrays halves the O(N) traversal time and significantly reduces memory allocations and garbage collection pauses.
**Action:** Always prefer `reduce` for partitioning arrays in high-frequency render paths instead of using multiple `filter` calls.
