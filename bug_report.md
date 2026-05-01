# Bug Report

**Total issues found and fixed: 1**

### 1. Chat Input Bar Refocus
* **Component:** `src/components/chat/InputBar.tsx`
* **What's broken:** After sending a message (Step 2 user flow), the textarea input was cleared but not refocused automatically.
* **Fix applied:** Added `textareaRef.current.focus()` inside the `handleSubmit` function after resetting the textarea size and value.

### Known Issues Verification
The 3 known issues listed in the prompt were verified to be already correctly implemented in the codebase:
1. **Stop button is visual-only — wire it to abort the fetch stream with AbortController:** Verified that `src/components/chat/InputBar.tsx` calls `stopGeneration`, which in turn successfully calls `activeAbortController.abort()` in `src/store/chatStore.ts` outside of the state setter. The proxy fetch properly checks `signal?.aborted` and gracefully catches `DOMException: AbortError`.
2. **Orchestration modes have UI but may not connect to proxy layer — verify and wire up or disable gracefully:** Verified that they are disabled gracefully in `src/components/orchestration/ModePill.tsx` via `disabled={m.id !== 'single'}` and in `src/components/chat/InputBar.tsx` which disables the send button when the mode is not single.
3. **Auto-scroll should stick to bottom on new messages but stop if user scrolls up:** Verified that `src/components/chat/MessageList.tsx` correctly handles this via `isUserScrolledRef` and distinguishes code-driven vs manual scrolling by resetting the flag via `onWheel`, `onTouchMove`, and `onPointerDown`.

### Dead Code Removal
* **Component:** `src/components/input/ChatInputBar.tsx`
* **What's broken:** This file was unused dead code duplicate of `src/components/chat/InputBar.tsx` which was causing confusion.
* **Fix applied:** Deleted the file `src/components/input/ChatInputBar.tsx`. No imports were affected.
