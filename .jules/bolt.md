## 2024-05-14 - Memoizing AgentRow in ProviderSelector
**Learning:** Polling state like `useAgentHealth` updates global arrays (or creates new arrays) every cycle. Child components that map over these arrays (like `AgentRow`) will re-render continuously if they aren't wrapped in `React.memo` and if they use inline arrow functions for callbacks.
**Action:** When mapping over frequently updated arrays (like polling results), always wrap list item components in `React.memo()` and pass stable references using `useCallback` for their event handlers.
