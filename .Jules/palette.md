## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-04-24 - Input Focus Management
**Learning:** Calling `.focus()` immediately after message submission on an input disabled by a loading state fails because disabled inputs cannot hold focus.
**Action:** Use a `useEffect` hook that listens for `!isStreaming` to safely call `textareaRef.current.focus()` and ensure continuous keyboard interaction without manual clicks. Additionally, ensure primary textareas have `autoFocus` on initial load.
