## 2024-05-24 - Focus input after sending message
**Learning:** In chat interfaces, users expect to seamlessly continue typing after sending a message. If the text input field loses focus when a message is sent, it disrupts the user's flow.
**Action:** Programmatically re-focus the text input field (e.g., via `textareaRef.current.focus()`) immediately after a message is sent.
