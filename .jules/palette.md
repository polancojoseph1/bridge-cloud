## 2026-06-01 - Add focus visible styles to instance tab bar buttons
**Learning:** Found multiple instances of buttons in `InstanceTabBar.tsx` that lacked `focus-visible` styles, making keyboard navigation difficult to track. Ensuring buttons implement `focus-visible:ring` is essential for accessibility.
**Action:** Always check newly added custom interactive elements or layout structural buttons for `focus-visible` styles using standard Tailwind classes (e.g. `focus-visible:outline-none focus-visible:ring-2`).
