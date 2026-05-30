## 2024-05-30 - Chat input autoFocus and refocusing
**Learning:** Disabled inputs lose focus when re-enabled. When a chat input is disabled during streaming generation (to prevent interruption), it loses keyboard focus. Simply calling `.focus()` on an `onSubmit` handler fails because the element gets disabled right after.
**Action:** Always pair `disabled={isStreaming}` with a `useEffect` hook that listens for `!isStreaming` to explicitly refocus the input when generation completes, ensuring continuous keyboard interaction loops.
