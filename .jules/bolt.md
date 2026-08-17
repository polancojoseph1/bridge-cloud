## 2024-05-18 - Avoid destructing from Zustand store

**Learning:** When using Zustand, destructuring properties directly from the store hook (e.g., `const { profiles, activeProfileId } = useServerStore()`) will cause the component to subscribe to the entire store state. This leads to massive over-rendering because the component will re-render whenever ANY value in the store changes, even if the component doesn't use that value.

**Action:** Always use individual, targeted selectors when extracting values from a Zustand store (e.g., `const profiles = useServerStore(s => s.profiles);`). This limits the component's subscription to only the specific pieces of state it needs, preventing unnecessary re-renders.
