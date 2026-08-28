## 2024-05-22 - Store Destructuring Anti-pattern
**Learning:** Object destructuring of Zustand store hooks (e.g. `const { profiles, activeProfileId, connectProfile, openManage } = useServerStore();`) creates a global subscription. This causes the component to re-render whenever ANY property in the store changes, even those not used in the component. In React, this is a major source of unnecessary re-renders.
**Action:** Always use individual, targeted selectors when extracting values from Zustand stores (e.g. `const profiles = useServerStore(s => s.profiles)`).
