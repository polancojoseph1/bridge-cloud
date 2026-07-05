## 2024-05-24 - Pre-compute Maps/Sets for O(N) loop lookups
**Learning:** Using `array.find()` inside a `reduce()` or `map()` loop creates an O(N*M) time complexity bottleneck. In React components with rapidly changing state (like streaming), this causes significant CPU overhead during render cycles.
**Action:** Always pre-compute a `Set` or `Map` before the loop to achieve O(1) lookups during array traversal, reducing overall complexity to O(N).
