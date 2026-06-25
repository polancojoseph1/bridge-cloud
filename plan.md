1. **Fix Orchestration modes connection / disabling**
   - We need to re-add `ModePill` and `NodeTray` to `src/components/topbar/TopBar.tsx`.
   - Remove the disabled state `return null;` from `ModePill.tsx`.
   - (I previously wrote the patch to apply this but I reverted it or didn't apply it permanently? Wait, `git log -p src/components/topbar/TopBar.tsx` didn't show my patch because I never applied it properly? Actually, I applied it with `patch_topbar.js` but it seems it didn't get saved correctly, let me use `replace_with_git_merge_diff`.)

2. **Fix Stop Button AbortController**
   - The user requested: "Stop button is visual-only — wire it to abort the fetch stream with AbortController".
   - `activeAbortController` in `src/store/chatStore.ts` gets aborted, but it doesn't abort the stream correctly? Or is the proxy fetch call aborting but we still append chunks?
   - Let's check `src/store/chatStore.ts`. In `sendMessage`, it catches `AbortError`, but does it actually close the reader inside `streamFromProxy`?
   - `src/lib/streaming.ts` catches the `abort` event and does `reader.cancel()`.
   - Wait, `activeAbortController.abort()` passes `new DOMException('Aborted', 'AbortError')`. But Next.js cross-environment fetch may not like `DOMException`. Memory: "When aborting a fetch stream via `AbortController` in cross-environment Next.js code, avoid using `new DOMException('Aborted', 'AbortError')` which can cause silent failures. Instead, use a standard error object: `const err = new Error('Aborted'); err.name = 'AbortError'; controller.abort(err);`."
   - Ah! That's exactly it! Let's update `src/store/chatStore.ts`.

3. **Complete pre-commit steps.**
   - Request review again.
