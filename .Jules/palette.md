## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-06-07 - Add autoFocus and persistent focus to chat inputs
**Learning:** For continuous keyboard interaction in a chat app, `autoFocus` is not enough. When inputs are disabled during AI generation streams, they lose their focus state and cannot receive focus commands until they are re-enabled.
**Action:** Always combine the initial `autoFocus` prop with a `useEffect` hook that listens for the loading/streaming state to finish (`!isStreaming`), safely calling `.focus()` to programmatically recapture cursor focus once the field becomes interactive again.
