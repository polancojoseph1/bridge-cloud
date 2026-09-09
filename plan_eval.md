I have reviewed the code to check the "Known Issues to Fix" list.
- Stop button is visual-only — wire it to abort the fetch stream with AbortController
The code in `src/store/chatStore.ts` does seem to have AbortController functionality, but it is currently structured such that when `stopGeneration` is called, it might immediately set `isStreaming = false` and resolve, skipping any pending logic or failing to abort properly if not synced? Let me double-check.
`stopGeneration` calls `activeAbortController.abort()`. `sendMessage` wraps the stream loop and explicitly handles `AbortError`. Is it failing to cancel the network request because we aren't passing `signal` properly into `fetch` or `fetch` isn't using it?
Ah, `sendMessage` has `const hasServer = ...` and calls `streamFromProxy(agentId, content, convId, onChunk, undefined, activeAbortController.signal)`. Then `streamFromProxy` passes `signal` to `fetch`. `fetch` cancels the stream. Wait, does `stopGeneration` not correctly clear things, or is the issue already fixed?
Let me check the diffs or just run the test for abort stream.
