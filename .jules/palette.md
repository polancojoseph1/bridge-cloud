## 2024-05-28 - Keyboard accessibility for custom dropdowns
**Learning:** Custom dropdown components like `ProviderSelector` and `AgentSelector` were using `<div role="option">` but lacked proper keyboard support. While they worked for mouse users, keyboard users could not tab to the options or select them with Enter/Space.
**Action:** When implementing custom dropdowns or comboboxes with `role="option"`, always ensure the options have `tabIndex={0}`, visible focus states (e.g., `focus-visible:ring`), and `onKeyDown` handlers that support at least 'Enter' and 'Space' selection.
