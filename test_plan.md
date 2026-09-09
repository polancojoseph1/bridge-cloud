Plan:
1. Fix "Stop button is visual-only":
Wait, the AbortController is indeed there:
```typescript
        if (activeAbortController) {
          activeAbortController.abort(new DOMException('Aborted', 'AbortError'));
        }
```
But wait, `DOMException` works inside the browser, maybe Next.js proxy fetch doesn't use it or catch it, or maybe `sendMessage`'s catch block doesn't properly catch it?
Wait, if it catches it:
```typescript
        } catch (error: unknown) {
          if ((error as any)?.name === 'AbortError' || (error instanceof DOMException && error.name === 'AbortError') || (error as any)?.message === 'Aborted') {
            // User stopped generation, we just end here gracefully
          } else {
```
Is the stop button actually wired to the AbortController? Yes, `InputBar.tsx` calls `stopGeneration`. What's the bug?
The memory says:
"When cancelling an active operation using an AbortController stored within a Zustand store (e.g., chatStore.ts), ensure abort() is invoked *before* applying any state updates that reset or clear the controller reference to avoid losing the ability to abort."

In `chatStore.ts` inside `stopGeneration`:
```typescript
      stopGeneration: () => {
        set(s => {
          // updates state and sets isStreaming: false
        });
        if (activeAbortController) {
          activeAbortController.abort(new DOMException('Aborted', 'AbortError'));
        }
      },
```
Wait! `activeAbortController` is NOT part of Zustand state! It's a module-level let binding:
```typescript
let activeAbortController: AbortController | null = null;
```
If we set `isStreaming: false` first, wait, does that unmount the component and cause issues? No.
Let's see if something else resets `activeAbortController` to null when state changes? No, only the `finally` block in `sendMessage` does:
```typescript
        finally {
          if (flushTimeout) clearTimeout(flushTimeout);
          flushChunk();
          activeAbortController = null;
        }
```
Wait! If `isStreaming` is set to false in `stopGeneration`, does the React component re-render, and maybe `sendMessage` completes because it checks `isStreaming`?
No, `sendMessage` doesn't check `isStreaming` inside its loop.
But wait! If the `sendMessage`'s inner React state changes, it doesn't break the promise.
Wait, let's look at the memory hint again:
"When cancelling an active operation using an AbortController stored within a Zustand store (e.g., chatStore.ts), ensure abort() is invoked *before* applying any state updates that reset or clear the controller reference to avoid losing the ability to abort."
Ah! `stopGeneration` sets state, which triggers a React render. The fetch might be aborted, but maybe the state update happens and then we abort?
If we abort *before* the `set(...)`, it works?
Wait, what if `activeAbortController.abort()` happens first, then `set()`? Let's just move it before `set()`.

Wait, the hint also says:
"When cancelling an active operation using an AbortController stored within a Zustand store (e.g., chatStore.ts), ensure abort() is invoked *before* applying any state updates that reset or clear the controller reference to avoid losing the ability to abort."
Oh! In `chatStore.ts`, the `sendMessage` has a loop, but wait, `activeAbortController` is just a global variable, not stored in the store. Wait, is there a `controller` in the store? No, it's just `let activeAbortController`.
If `abort()` is called *after* `set()`, maybe `isStreaming` becomes false, which triggers `sendMessage` to... nothing?
Wait, if `isStreaming: false` is set by `stopGeneration`, then the `finally` block of `sendMessage` runs after `abort` is caught.
If we do `activeAbortController?.abort()` BEFORE `set(...)`, it's safer. Let's do that.

2. "Orchestration modes (broadcast, parallel, pipeline, gather) have UI but may not connect to proxy layer — verify and wire up or disable gracefully"
In `ChatInputBar.tsx` and `InputBar.tsx`:
Wait, the hint says:
"In the Bridge Cloud application, orchestration modes other than 'single' are currently unsupported in the chat input layer. UI components like `InputBar` should disable message sending and display an 'Orchestration modes coming soon!' placeholder/title when `orchestrationMode !== 'single'`."
In `src/components/chat/InputBar.tsx`:
It seems `InputBar.tsx` doesn't check for `orchestrationMode` to disable sending or show the placeholder.
`ChatInputBar.tsx` is an unused component, as per memory.
So we need to modify `src/components/chat/InputBar.tsx` to handle `orchestrationMode !== 'single'`.

3. "Auto-scroll should stick to bottom on new messages but stop if user scrolls up"
In `src/components/chat/MessageList.tsx`:
```typescript
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Fix: Using Math.ceil(scrollTop + clientHeight) can sometimes be slightly off on different zoom levels,
    // ensuring precision within the threshold
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
```
If the user scrolls up, `isUserScrolledRef.current = true`. So auto-scroll is disabled.
But what if the user scrolls back down? It sets `isUserScrolledRef.current = false`. So auto-scroll re-enables.
But the issue says: "Auto-scroll should stick to bottom on new messages but stop if user scrolls up"
Wait, if it's already working, what's broken?
Let me check the `MessageList.tsx` again.
