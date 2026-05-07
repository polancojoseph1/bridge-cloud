# Bridge Cloud Issue Report

Total issues found: 3

1. **Bug: Stop button does not abort fetch stream**
   - **Component:** `src/store/chatStore.ts`
   - **What's broken:** The stop button was visual only; `activeAbortController.abort()` was called without an `AbortError` which the rest of the try-catch block expected, leaving downstream consumers unaware of the abort reason.
   - **Fix applied:** Added `new DOMException('Aborted', 'AbortError')` into the `.abort()` call.

2. **Bug: Auto-scroll logic fails when user scrolls up and down**
   - **Component:** `src/components/chat/MessageList.tsx`
   - **What's broken:** The auto-scroll behavior relied on a fractional calculation against a rounded number via `Math.ceil`, causing issues on zoom levels and fractional scrolling.
   - **Fix applied:** Removed `Math.ceil` from `distanceToBottom` calculation, as browsers have sub-pixel scrolling precision.

3. **Bug: Orchestration Modes missing connection UI handling**
   - **Component:** `src/components/orchestration/ModePill.tsx`, `src/components/chat/InputBar.tsx`, `src/components/orchestration/NodeTray.tsx`
   - **What's broken:** Orchestration modes (broadcast, parallel, pipeline, gather) have UI elements but do not currently connect to the proxy layer, causing potential empty states or errors if selected.
   - **Fix applied:** Verified that non-single orchestration modes are gracefully disabled via `disabled={isDisabled}` and `onClick` handlers, preventing them from being clicked or breaking the UI. `InputBar.tsx` properly blocks input and shows "Coming soon". `NodeTray.tsx` returns `null` to disable it until wired.

