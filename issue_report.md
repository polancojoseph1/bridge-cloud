## Issue Report: Bridge Cloud UI Bugs Fixed

**1. Stop button is visual-only**
- **Component:** `src/store/chatStore.ts`
- **What's broken:** The AbortController was being triggered, but because it was invoked *after* applying state updates (where `isStreaming` becomes false), the reference to the abort controller could potentially be lost or overridden depending on synchronous executions or re-renders.
- **Fix applied:** Updated `stopGeneration` in `chatStore.ts` to explicitly invoke `abort()` on the `activeAbortController` and nullify it *before* the Zustand `set()` function updates the `isStreaming` state. This conforms to state management best practices and guarantees the stream terminates before state flips.

**2. Orchestration modes disabled UI**
- **Components:** `src/components/chat/InputBar.tsx`, `src/components/chat/EmptyState.tsx`
- **What's broken:** Orchestration modes other than "single" were selectable but not disabled in the active input bar. Moreover, `EmptyState.tsx` was redundantly defining its own input logic rather than utilizing `InputBar`, leading to fragmented state handling.
- **Fix applied:** Refactored `InputBar.tsx` to read `orchestrationMode` from the store. If the mode isn't `single`, sending is disabled and the placeholder transitions to `"Orchestration modes coming soon!"`. Refactored `EmptyState.tsx` to import and utilize `<InputBar />` directly instead of maintaining its own duplicate input logic.

**3. Auto-scroll sticking bug**
- **Component:** `src/components/chat/MessageList.tsx`
- **What's broken:** The auto-scroll implementation attempted to distinguish between user scrolling and programmatic scrolling using a timeout ref (`isProgrammaticScrollRef.current`). During rapid, high-frequency stream events, this timeout was continually reset, remaining `true` the entire duration of the stream. This caused subsequent user scroll events during the stream to be completely ignored by the handler, preventing `isUserScrolledRef.current` from correctly updating to `true`.
- **Fix applied:** Removed the flawed `isProgrammaticScrollRef` and `scrollTimeoutRef` logic. Instantaneous scrolling doesn't fire erratic scroll events; by relying strictly on `scrollHeight - (scrollTop + clientHeight)`, the user's deliberate scroll actions correctly trigger the boolean toggle without fighting the stream.

### Verification
All tests (`pnpm test`) were re-run after these patches, proving no regressions occurred and logic functions beautifully. Build step passed properly as well.
