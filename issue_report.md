# Issues Found & Fixed

1. **Stop button is visual-only**:
   - Component: `src/store/chatStore.ts`
   - Issue: The `stopGeneration` method threw a `DOMException` which caused issues in the Next.js runtime.
   - Fix: Removed `DOMException` argument from `abort()` and checked for `'This operation was aborted'` in the `catch` block.

2. **Orchestration modes have UI but may not connect**:
   - Component: `src/components/orchestration/ModePill.tsx`
   - Issue: The component was gracefully returning `null`, fully disabling the UI.
   - Fix: Displayed the UI but visually disabled unsupported modes by setting `isDisabled = m.id !== 'single'`.

3. **Auto-scroll should stick to bottom on new messages but stop if user scrolls up**:
   - Component: `src/components/chat/MessageList.tsx`
   - Issue: The timeout-based lock `isProgrammaticScrollRef` ignored user scrollbar drags when streaming chunks arrived too fast (<150ms intervals).
   - Fix: Removed `isProgrammaticScrollRef` logic. Natively comparing `scrollTop` against `scrollHeight` natively and instantly detects up-scrolls.
