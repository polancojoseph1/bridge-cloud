## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## $(date +%Y-%m-%d) - Refocusing Chat Inputs
**Learning:** When refocusing chat inputs after submission, if the input is disabled during the loading/streaming state (e.g., `disabled={isStreaming}`), calling `.focus()` immediately fails because disabled inputs cannot hold focus.
**Action:** Use a `useEffect` hook that listens for the loading state to complete (e.g., `!isStreaming`) to safely call `textareaRef.current.focus()` and ensure continuous keyboard interaction.
