## 2025-05-18 - Avoid O(N^2) lookups with Map or direct indexing
**Learning:** In NodeTray.tsx, finding a node inside a loop/reduce using `nodes.find` takes O(N) time each iteration, resulting in O(N*M) or O(N^2) complexity. This causes unnecessary overhead during rendering.
**Action:** Use a pre-computed map `Map<string, BridgeNode>` or object lookup `Record<string, BridgeNode>` to achieve O(1) lookups during iteration.
