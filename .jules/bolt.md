## $(date +%Y-%m-%d) - ProviderSelector re-renders often because it lacked memoized list items
**Learning:** `ProviderSelector` used an inline arrow function for rendering `AgentRow` which was not wrapped in `React.memo()`. This caused it to needlessly rerender every item whenever the dropdown was toggled or an event occurred.
**Action:** When working on lists that might rerender frequently, ensure the item component is wrapped in `React.memo` and primitive values or `useCallback` functions are passed to it instead of complex, changing objects or inline callbacks.
