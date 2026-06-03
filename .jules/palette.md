## 2026-06-03 - Refocusing Disabled Inputs After Streaming
**Learning:** When refocusing chat inputs after submission, if the input is disabled during the loading/streaming state, calling `.focus()` immediately fails because disabled inputs cannot hold focus.
**Action:** Always use a `useEffect` hook that listens for the loading state to complete (e.g., `!isStreaming`) to safely call `textareaRef.current.focus()` and ensure continuous keyboard interaction.
