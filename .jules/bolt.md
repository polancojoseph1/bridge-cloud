## 2024-05-23 - Zustand Array Mutation Performance
**Learning:** When toggling a mutually exclusive boolean flag (e.g., `isDefault`) across an array in a Zustand store, using `.map()` creates unnecessary object allocations for every unchanged item.
**Action:** Use `.findIndex()` to locate both the previously active item and the newly targeted item, shallow clone the array, and mutate only those specific indices to prevent O(N) object allocations for unchanged items.
