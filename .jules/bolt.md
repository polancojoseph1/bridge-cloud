## 2024-06-14 - Zustand Store Array Operations
**Learning:** Performing `O(N)` mapping operations (e.g., `profiles.map(...)`) on large array state updates inside a Zustand store causes unnecessary array allocations and shallow clones, even for unmodified items. This forces React components subscribed to unaffected items to re-render.
**Action:** Use `.findIndex()` to locate the specific element that needs mutation, copy the top-level array, update only the target element via index assignment, and preserve reference equality for unchanged items.
