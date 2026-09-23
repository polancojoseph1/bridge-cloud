## 2024-09-23 - Memoizing Mapped Components with Primitive Props
**Learning:** Wrapping mapped child list items in `React.memo()` is ineffective if the parent passes inline arrow functions (e.g., `onSelect={() => onSelect(agent.id)}`). This defeats memoization because a new function reference is created on every render, causing O(N) re-render cascades.
**Action:** When memoizing list items, always pass primitive identifiers (e.g., `id`) to their handlers instead of relying on inline arrow functions, and provide stable function references via `useCallback` from the parent.
