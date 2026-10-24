
## 2024-05-18 - Optimize O(N^2) Array Lookups in React useMemo
**Learning:** Using `array.find()` inside of a `.reduce()` or `.map()` block inside a `useMemo` over related collections inherently creates an O(N*M) or O(N^2) time complexity.
**Action:** Always pre-compute an O(1) lookup Map/Record for the target collection outside of the loop, reducing total complexity to O(N+M).
