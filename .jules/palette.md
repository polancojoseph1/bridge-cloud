## 2024-10-24 - Input autofocus edge cases
**Learning:** Adding `.focus()` directly on a React input after submission fails if the input was disabled during an async streaming phase (e.g. `disabled={isStreaming}`), because disabled elements cannot hold focus. Furthermore, simply checking `!isStreaming` isn't always enough if the DOM hasn't flushed the attribute removal yet.
**Action:** Use a `useEffect` hook that depends on the `isStreaming` state, and inside it, wrap the `.focus()` call in a `setTimeout(..., 0)` to guarantee the DOM has re-enabled the input before focus is requested.
