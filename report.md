Total issues found: 3
1. ChatStore/MockApi: Stop button threw DOMException causing errors in Next.js environment. Replaced with standard Error with name AbortError.
2. MessageList: Auto-scroll was not reliably scrolling to bottom for new incoming assistant messages. Changed to unconditionally set isUserScrolledRef.current = false when messages.length increases.
3. ModePill: Orchestration modes component was completely hidden. Now gracefully renders with unsupported options disabled.
