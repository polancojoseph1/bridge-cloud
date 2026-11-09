## 2024-11-09 - O(1) Map Lookups
**Learning:** Using `Array.prototype.find()` inside loops or reducers creates hidden O(N*M) time complexity. This happened in `NodeTray.tsx` where mapping over selected IDs or pipeline order invoked `.find()` on the `nodes` array for each item.
**Action:** Always pre-compute an O(1) lookup `Map` or dictionary object when iterating over one array to find items in another array, effectively reducing the time complexity to O(N+M).
