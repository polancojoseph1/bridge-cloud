## 2024-05-18 - Refocusing chat inputs after stream completion
**Learning:** When refocusing chat inputs after submission, if the input is disabled during the loading/streaming state (`disabled={isStreaming}`), calling `.focus()` immediately on submit fails because disabled inputs cannot hold focus.
**Action:** Use a `useEffect` hook that listens for the loading state to complete (e.g., `!isStreaming`) to safely call `textareaRef.current.focus()` and ensure continuous keyboard interaction.
