## 2024-05-24 - Optimize ServerSwitcherPopover Zustand subscriptions
**Learning:** Found a component using object destructuring to extract multiple properties from a Zustand store (`const { a, b } = useStore()`). This is an anti-pattern as it creates a global subscription, causing unnecessary re-renders anytime any state in the store changes.
**Action:** Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`) instead of destructuring the whole store object.
