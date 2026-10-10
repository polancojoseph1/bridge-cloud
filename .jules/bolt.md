## 2026-10-10 - Prevent O(N) re-renders in mapped React list items
**Learning:** When health polling updates (which is frequent), without `memo`, EVERY agent row in the list re-renders. When mapping React components that receive functions (e.g. `onSelect`), providing inline anonymous functions directly in the `.map()` block forces all list items to re-render.
**Action:** Use `React.memo` for the list item component (`AgentRow`), and provide stable function references using `useCallback` in the parent component for event handlers instead of inline arrow functions in the map.
