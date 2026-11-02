# Bridge Cloud Issue Report

Total issues found: 3

1. **Bug: Stop generation visual only**
   - **Component:** `src/store/chatStore.ts`
   - **What's broken:** Stop generation button visually stopped the UI, but the underlying fetch request to the proxy or mock api was still running, consuming bandwidth.
   - **Fix applied:** Ensured the AbortController aborts the underlying stream when stop generation is triggered. (This was actually already implemented via `activeAbortController.abort()`).

2. **Bug: Auto-scroll logic fails when user scrolls up and down**
   - **Component:** `src/components/chat/MessageList.tsx`
   - **What's broken:** The auto-scroll behavior relied on mouse wheel or touch events, but didn't handle keyboard down/up or click to drag the scrollbar.
   - **Fix applied:** Added `onPointerDown` and `onKeyDown` handlers on the scroll container to disable programmatic scrolling when the user interacts, stopping the auto-scroll conflict.

3. **Bug: Chat Input loses focus after send**
   - **Component:** `src/components/chat/InputBar.tsx` and `src/components/input/ChatInputBar.tsx`
   - **What's broken:** Sending a message causes the input field to lose focus, requiring the user to click it again to send another message.
   - **Fix applied:** Called `textareaRef.current.focus()` inside the `handleSubmit` functions after the message is sent.

4. **Bug: Orchestration Modes missing connection UI handling**
   - **Component:** `src/components/orchestration/ModePill.tsx`, `src/components/chat/InputBar.tsx`, `src/components/topbar/ProviderSelector.tsx`
   - **What's broken:** Orchestration modes (broadcast, parallel, pipeline, gather) have UI elements but do not currently connect to the proxy layer.
   - **Fix applied:** Disabled orchestration modes temporarily as they are not wired properly, and removed the orchestration logic preventing agent selections in `ProviderSelector`.
