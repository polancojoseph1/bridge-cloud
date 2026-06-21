## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-06-21 - Input Refocusing
**Learning:** Disabled chat inputs cannot receive focus while disabled during streaming states.
**Action:** Use a `useEffect` hook listening to the streaming state (`!isStreaming`) to safely trigger focus rather than focusing synchronously on submit.
