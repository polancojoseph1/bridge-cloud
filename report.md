# Testing Report

Total issues found: 4

## Bugs and Fixes
1. **Component:** `SendButton` (`src/components/input/SendButton.tsx`)
   - **Broken:** The application failed to compile due to a JSX duplicate attribute error (`title` prop).
   - **Fix:** Removed the duplicate `title` property and combined logic to fall back to default text if `title` isn't provided. Added `e.preventDefault()` inside `onMouseDown` and `onClick` handlers for the Stop button to prevent focus stealing from the chat input.

2. **Component:** `MessageList` (`src/components/chat/MessageList.tsx`)
   - **Broken:** Auto-scroll was not reliably tracking when to stick to bottom if user scrolled up versus when a new message was added.
   - **Fix:** Unconditionally cleared the `isUserScrolledRef.current = false` flag whenever the total message array length increases to ensure reliable auto-scroll.

3. **Component:** `InputBar` (`src/components/chat/InputBar.tsx`)
   - **Broken:** Orchestration modes were visual-only without functional wiring to the proxy layer.
   - **Fix:** Gracefully degraded UI interaction by disabling input and showing placeholder text "Orchestration modes coming soon!" when the mode is not 'single'.

4. **Component:** `chatStore`, `mockApi` (`src/store/chatStore.ts`, `src/lib/mockApi.ts`)
   - **Broken:** Stop button stream abort logic relied on `DOMException`, which fails silently in Next.js backend Node environments. Stop stream action was visually changing state but failing to close stream.
   - **Fix:** Replaced `new DOMException('Aborted', 'AbortError')` with a standard `Error` object where `name` is explicitly set to `AbortError`. Guarded error handling to handle cases properly cross-environment.

Tests passing successfully.
