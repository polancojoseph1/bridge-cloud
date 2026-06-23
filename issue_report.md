# Bridge Cloud Bug Report

Total issues found: 6

1. **Bug: Stop Button Silent Failure**
   - **Component:** `src/store/chatStore.ts`
   - **What's broken:** Stop button is visual-only and silently failed to stop generation due to usage of `DOMException`, which might not be supported across all JS environments, causing the catch block to bypass the abort handler.
   - **Fix applied:** Replaced `DOMException` with a standard `Error` object containing `name = 'AbortError'`, correctly triggering the stream abort logic in `streaming.ts`.

2. **Bug: Auto-scroll sticking when user scrolls up**
   - **Component:** `src/components/chat/MessageList.tsx`
   - **What's broken:** Programmatic scrolling flag was only cleared on `onWheel` and `onTouchMove`. Manual scrollbar clicks/drags (`onMouseDown`) and taps (`onTouchStart`) did not clear the flag, locking out manual scroll detection.
   - **Fix applied:** Added `onMouseDown` and `onTouchStart` event handlers to the container to set `isProgrammaticScrollRef.current = false`, allowing immediate user scroll detection.

3. **Bug: Auto-scroll imprecise triggering due to subpixel scaling**
   - **Component:** `src/components/chat/MessageList.tsx`
   - **What's broken:** Browser sub-pixel rendering caused `scrollHeight - (scrollTop + clientHeight)` to return fractional differences slightly above 0, preventing the view from snapping fully to the bottom.
   - **Fix applied:** Added `Math.ceil` to the distance calculation to properly round up fractional pixel values and ensure reliable auto-scrolling triggers.

4. **Bug: Orchestration Modes Missing Input/UI Handling**
   - **Component:** `src/components/chat/InputBar.tsx`
   - **What's broken:** Selected orchestration modes (broadcast, pipeline, etc.) had UI mode selection but were not connected to the proxy layer, meaning they would execute as a standard single chat without gracefully failing.
   - **Fix applied:** Disabled the submit button, text area, and placeholder text when `orchestrationMode !== 'single'`, showing a "Coming soon" placeholder instead of allowing a broken request.

5. **Bug: Empty State Input lacks Auto-Focus**
   - **Component:** `src/components/chat/EmptyState.tsx`
   - **What's broken:** The primary chat input in the empty state did not auto-focus, forcing users to click manually before typing.
   - **Fix applied:** Added the `autoFocus` prop to the `textarea` in `EmptyState.tsx`.

6. **Bug: Input Bar lacks Auto-Focus and Re-focus after generation**
   - **Component:** `src/components/chat/InputBar.tsx`
   - **What's broken:** The main chat input did not auto-focus on load, and lost focus after the input was disabled during generation, forcing users to click back into the box to send another message.
   - **Fix applied:** Added the `autoFocus` prop to the `textarea`, and introduced a `useEffect` hook that waits for `!isStreaming` and uses a short `setTimeout` to refocus `textareaRef.current` once the input becomes re-enabled.
