## Bridge Cloud - Bug Report

Total issues found: 5

1. **Stop button visual-only (Bug 1)**
   - **Component:** `chatStore.ts`
   - **What's broken:** Stop button was visual only and did not actually abort the stream.
   - **Fix applied:** Cleared `activeAbortController` by setting it to `null` immediately after calling `.abort()` in `stopGeneration` action to correctly terminate the fetch stream and avoid subsequent streams from being falsely aborted.

2. **Orchestration mode UI (Bug 2)**
   - **Component:** `InputBar.tsx` (and input interactions)
   - **What's broken:** Orchestration modes (broadcast, parallel, pipeline, gather) have UI but are not fully implemented.
   - **Fix applied:** Disabled the text area and send button when the orchestration mode is not 'single', and set the tooltip title/placeholder message to "Orchestration modes coming soon!".

3. **Auto-scroll behavior on manual scroll (Bug 3)**
   - **Component:** `MessageList.tsx`
   - **What's broken:** Auto-scroll should stick to the bottom on new messages but stop if the user scrolls up, which was not working reliably.
   - **Fix applied:** Added `onPointerDown` and `onKeyDown` event listeners to the message list container to reliably capture user interaction and prevent programmatic scrolling conflicts, allowing user scroll state `isUserScrolledRef.current` to function correctly.

4. **Build error with JSX attributes (Bug 4)**
   - **Component:** `SendButton.tsx`
   - **What's broken:** `Type error: JSX elements cannot have multiple attributes with the same name.` - Multiple `title` attributes were present.
   - **Fix applied:** Combined the `title` attribute logic into a single dynamic attribute to preserve both intended functionalities and avoid overriding dynamic behavior.

5. **Input clear and refocus (Bug 5)**
   - **Component:** `InputBar.tsx`
   - **What's broken:** The chat input field did not refocus after sending a message, forcing users to click it again to continue typing.
   - **Fix applied:** Implemented a programmatic re-focus using `setTimeout(() => textareaRef.current?.focus(), 0)` in the `handleSubmit` callback.
