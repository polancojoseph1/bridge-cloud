## 2026-09-09 - Object Destructuring from Zustand Stores Causes Unnecessary Re-renders
**Learning:** Using object destructuring (e.g., `const { a, b } = useStore() `) directly from a Zustand store subscribes the component to the *entire* store. This causes the component to re-render whenever *any* unrelated state in the store changes (like `connectionStatus` updating in the background).
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`) instead of global destructuring to ensure O(1) render stability when unrelated store states update.
