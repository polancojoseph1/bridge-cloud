## 2026-10-24 - Orchestration Modes Fallback UX

**Learning:** When interactive elements (like the chat input) cannot function due to unfulfilled state requirements (e.g., experimental orchestration modes that aren't yet wired to the backend), silently ignoring the user's action causes frustration.
**Action:** Always provide graceful degradation by explicitly disabling the input controls and providing a clear, contextual fallback message (e.g., updating the placeholder text to "Coming soon" and disabling the `<textarea>`) to communicate the system's current limitations to the user.
