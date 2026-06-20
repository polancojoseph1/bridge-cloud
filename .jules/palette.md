## 2026-06-20 - Refocusing chat inputs after streaming
**Learning:** When a chat input is disabled during a streaming state, calling `.focus()` immediately fails.
**Action:** Use a `useEffect` hook that listens for the loading state to complete (e.g., `!isStreaming`) to safely call `textareaRef.current.focus()` and ensure continuous keyboard interaction.
