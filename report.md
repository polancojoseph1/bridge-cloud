## Bugs Found and Fixed

1. **Stop button abort implementation**: `activeAbortController = null` is now cleared in `chatStore.ts` after stopping generation, so future sends work without being aborted unexpectedly.
2. **Disable proxy functionality for non-single orchestration modes**: Updated `sendMessage` in `chatStore.ts` to abort and warn if `orchestrationMode !== 'single'`, preventing unexpected fetch failures.
3. **Disable input and modify UI in non-single modes**: Updated both `ChatInputBar.tsx` and `InputBar.tsx` to handle disable logic, change placeholders, and prevent sending when not in 'single' orchestration mode.
4. **Refocus input bar after sending message**: Added `textareaRef.current.focus()` after calling `sendMessage` in both input bars so the user can seamlessly keep typing.
5. **Fix auto scroll pause issue**: Added `onPointerDown` and `onKeyDown` to the `MessageList.tsx` container to ensure user interaction (like clicking or typing) safely interrupts programmatic auto-scrolling during stream.
6. **Fix provider selector UI issue**: Updated `ProviderSelector.tsx` to prevent the z-index overlapping issue with the "Manage servers" button, moving it to its own absolute positioned wrapper block.
7. **Fix duplicate JSX title prop**: Fixed a bug where `SendButton` failed to compile due to duplicate `title` properties.

All tests passed successfully.
