## 2024-05-30 - Fix bugs in UI flows
**Learning:** Found an unused component that resulted in UI bugs. Removing duplicate code from `EmptyState.tsx` and utilizing the existing `InputBar.tsx` fixes the visual bug where the stop button didn't show up.
**Action:** Always favor component re-use.
