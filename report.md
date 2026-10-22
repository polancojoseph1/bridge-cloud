Found 4 issues during testing:

1. **EmptyState Input Synchronization**
   - Component: `src/components/chat/EmptyState.tsx`
   - Bug: Duplicate textarea logic, lacking stop button and correct state sync.
   - Fix: Removed redundant code, imported and used `<InputBar />` directly.

2. **Stop Button Visual-Only**
   - Component: `src/store/chatStore.ts`
   - Bug: `stopGeneration` passed a DOMException which failed gracefully to abort properly.
   - Fix: Modified to `activeAbortController.abort('Aborted')` to properly abort the stream.

3. **Auto-Scroll Snapping**
   - Component: `src/components/chat/MessageList.tsx`
   - Bug: Did not always snap to bottom for new incoming chunks because of `justAddedUserMsg` conditional check.
   - Fix: Unconditionally set `isUserScrolledRef.current = false` when messages length increases.

4. **Orchestration Modes UI Connection**
   - Component: `src/components/chat/InputBar.tsx`
   - Bug: UI modes available but unconnected to backend.
   - Fix: Disabled input/submit gracefully when mode is not 'single' with 'coming soon' tooltips.
