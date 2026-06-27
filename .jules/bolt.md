## 2024-06-26 - Prevent O(N*M) nested lookup in useMemo
**Learning:** In React components like NodeTray, reducing arrays while finding dependencies via nested array lookups (e.g., using \`.find()\` inside \`.reduce()\`) creates O(N*M) time complexity during render cycles and causes CPU spikes when dependency arrays change.
**Action:** Always pre-compute a \`Map\` or \`Set\` before the loop to achieve O(1) lookups during traversal, reducing total time complexity to O(N).
