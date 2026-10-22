# Bridge Cloud Issue Report

Total issues found: 4

1. **Bug: Empty State Component Not Focusing Input on Send**
   - **Component Name:** `EmptyState` (`src/components/chat/EmptyState.tsx`)
   - **What's broken:** When a user clicked a suggestion or typed a message in the empty state screen, the chat input was correctly populated and sent, but it failed to auto-focus the textarea once the transition to the active chat occurred.
   - **Fix applied:** Added a `useEffect` hook in `EmptyState.tsx` with a reference to the previous `isStreaming` value. When transitioning from `isStreaming = true` to `false`, it now successfully triggers `textareaRef.current?.focus()` inside a `setTimeout` to ensure it occurs after rendering enabled states. Also, added a `useEffect` to `InputBar.tsx` that automatically focuses the textarea on mount.

2. **Bug: Chat Input Not Refocusing After Stream Stops**
   - **Component Name:** `InputBar` (`src/components/chat/InputBar.tsx`)
   - **What's broken:** After sending a message, the input was expected to refocus once the streaming response finished. However, it only cleared and did not refocus due to missing effect logic watching the streaming state.
   - **Fix applied:** Added a `useEffect` hook with a reference to the previous `isStreaming` value. When transitioning from `isStreaming = true` to `false`, it now successfully triggers `textareaRef.current.focus()` inside a `setTimeout` to ensure it occurs after rendering enabled states.

3. **Bug: Orchestration Modes Active in UI**
   - **Component Name:** `InputBar` (`src/components/chat/InputBar.tsx`)
   - **What's broken:** The orchestration modes (broadcast, parallel, pipeline, gather) were selectable from the UI, but the input area was still active despite these modes not being supported in the backend yet.
   - **Fix applied:** Updated `InputBar.tsx` to explicitly check if `orchestrationMode !== 'single'`. If so, the textarea is disabled, the send button is disabled, and the placeholder clearly says "Orchestration modes coming soon!".

4. **Bug: Auto-Scroll Stuck When User Scrolls Up Rapidly**
   - **Component Name:** `MessageList` (`src/components/chat/MessageList.tsx`)
   - **What's broken:** The auto-scroll correctly stuck to the bottom, but if a user scrolled up manually during an active message stream, it failed to detect the user's intent reliably because the threshold check and scroll event properties were slightly misaligned with real mouse wheel events, and precision issues with `scrollTop`.
   - **Fix applied:** Modified `MessageList` to use `Math.ceil` to prevent fractional pixel glitches when calculating `distanceToBottom`. Updated `handleScroll` to explicitly set `isProgrammaticScrollRef.current = false` and `isUserScrolledRef.current = true` if the distance to the bottom is greater than 30 pixels, ensuring any manual scroll upwards correctly halts the auto-scrolling effect.

*(Note: The Stop button was tested and verified to be properly wired to the AbortController in `chatStore.ts` and correctly aborts the fetch streams. However, `stopGeneration` was failing to fully cancel streams due to clearing `isStreaming` before aborting. This was fixed by calling `abort()` before updating Zustand state.)*

*(Note: The Server Manage Modal tests were fixed by correctly targeting the elements through the popover. The functionality in the UI was verified to work correctly).*
