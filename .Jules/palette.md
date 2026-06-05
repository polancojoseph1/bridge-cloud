## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-05-18 - Input AutoFocus and Refocus
**Learning:** In React chat interfaces, adding `autoFocus` handles initial load, but dynamically switching between disabled/enabled states (like when streaming finishes) prevents native refocusing because elements lose focus entirely when disabled. A dedicated `useEffect` listening to the loading state is required to safely re-apply focus.
**Action:** Always pair `autoFocus` with a programmatic focus restoration effect triggered by the completion of loading/streaming states to ensure uninterrupted keyboard accessibility.
