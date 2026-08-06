# Bug Report

1. Component: EmptyState
   Issue: The chat input was a duplicated implementation rather than reusing InputBar, leading to inconsistent behaviors and missing features.
   Fix: Replaced the inline textarea implementation with the `<InputBar />` component and removed unused state and functions.

2. Component: InputBar / chatStore
   Issue: The "Stop generation" button stole focus from the textarea when clicked, and the stream abortion didn't work universally due to `DOMException` usage.
   Fix: Prevented default behavior on `onMouseDown` and `onClick` inside the stop generation button. Updated `chatStore.ts` to use a standard `Error` with `name = 'AbortError'` to safely trigger the abort controller across environments.

3. Component: InputBar / ModePill
   Issue: Orchestration modes were disabled with `return null` (hiding the UI) and not gracefully falling back in the input bar.
   Fix: Enabled rendering of `ModePill` in a disabled state (with appropriate tooltips) when modes other than "single" are selected. Disabled the textarea and submit button in `InputBar` with a placeholder text "Orchestration modes coming soon!" when in an unimplemented orchestration mode.

4. Component: MessageList
   Issue: Auto-scroll sometimes stuck and didn't reliably snap to the bottom on new messages because of role-checking conditionals.
   Fix: Unconditionally cleared the user-scrolled flag (`isUserScrolledRef.current = false`) when the total message array length increases.
