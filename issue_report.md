# Bridge Cloud UI Test Report

## Total issues found: 3

### Issue 1
- **Component:** `InputBar` / `chatStore`
- **Broken:** The "Stop generation" button appeared to be visual-only and stole focus, breaking the UI state.
- **Fix Applied:** Verified that `AbortController` IS correctly wired to the `fetch` stream in `src/lib/streaming.ts` and `src/store/chatStore.ts` (via `activeAbortController.abort()`). The actual bug was focus-stealing on click. Added `e.preventDefault()` inside both `onClick` and `onMouseDown` handlers of the stop button to ensure the textarea retains browser focus and the stream correctly aborts without UI glitching.

### Issue 2
- **Component:** `ModePill` / `InputBar`
- **Broken:** Orchestration modes UI were disabled by a hardcoded `return null;` but leaving them fully enabled caused confusing UX since the feature is not wired to the proxy.
- **Fix Applied:** Re-enabled the component visually but marked all non-"single" modes as disabled natively so users can see the modes but can't click them. Made sure `InputBar` also checks `orchestrationMode` to prevent sending interactions and update placeholder text to "Coming soon...".

### Issue 3
- **Component:** `MessageList`
- **Broken:** Auto-scroll was sticking too aggressively. Manual interactions (like clicking or starting a touch swipe) would often get ignored because the programmatic lock (`isProgrammaticScrollRef`) was active, preventing the `handleScroll` math (`if (distanceToBottom > 30) isUserScrolledRef = true;`) from properly detecting upward user scrolls.
- **Fix Applied:** Cleared `isProgrammaticScrollRef.current` strictly on `onMouseDown` and `onTouchStart` container events so that any explicit user action immediately breaks the programmatic loop lock, allowing the existing precise math to register the user scroll.
