## 2025-06-18 - Avoid array find() inside reduce()
**Learning:** O(N^2) time complexity is introduced by doing an array `.find()` inside of a `.reduce()` or `.map()` operation when creating derived states or computing values from an array.
**Action:** Use a pre-computed Set or Map for O(1) lookups during array traversal, reducing overall complexity to O(N).
