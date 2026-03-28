
## 2024-03-27 - [Array Filtering Optimization]
**Learning:** In frequently polling React components (like `ProviderSelector` handling health checks), replacing `const a = arr.filter(f1); const b = arr.filter(f2);` with a single `.reduce` pass to partition the arrays halves the O(N) traversal time and significantly reduces memory allocations and garbage collection pauses.
**Action:** Always prefer `reduce` for partitioning arrays in high-frequency render paths instead of using multiple `filter` calls.

## 2024-05-14 - [React.useMemo for Array Partitions]
**Learning:** In frequently polling React components (like `NewInstancePicker` handling health checks), even if array partitioning is optimized to O(N) using `reduce`, doing this on every render cycle when the underlying data hasn't changed still causes unnecessary CPU churn and memory allocations.
**Action:** Always wrap expensive or allocation-heavy array derivations (like `reduce` partitions) in `useMemo` within frequently re-rendering components, tying the dependency strictly to the source array.
