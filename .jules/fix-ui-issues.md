## 2024-05-10 - Fix UI Issues

**Summary:**
Addressed the following issues during testing user flow:
- Fixed the visually-only Stop Generating button. It was not aborting correctly due to an empty abort call. Replaced with `activeAbortController.abort(new DOMException('Aborted', 'AbortError'))` to trigger graceful fallback in `sendMessage`.
- Gracefully disabled Orchestration Modes by returning `null` from `ModePill.tsx` since backend orchestration layer isn't connected yet.
- Fixed auto-scroll logic in `MessageList.tsx`. Removed `Math.ceil()` which caused issues with zoom fractional values resulting in negative auto-scroll calculations.
