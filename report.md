Total issues found: 3

1. Component: InputBar.tsx
   What: Stop button was visual only and focus was lost after sending.
   Fix: Added e.preventDefault() to stop generation and useEffect for focus.
2. Component: ModePill.tsx
   What: Orchestration modes were hidden.
   Fix: Gracefully disabled buttons.
3. Component: MessageList.tsx
   What: Auto-scroll failed when user scrolled up.
   Fix: Unconditionally cleared scroll flag on new message.
