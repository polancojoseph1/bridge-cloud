## 2024-05-28 - Keyboard accessibility for custom dropdowns
**Learning:** Custom dropdown components like `ProviderSelector` and `AgentSelector` were using `<div role="option">` but lacked proper keyboard support. While they worked for mouse users, keyboard users could not tab to the options or select them with Enter/Space.
**Action:** When implementing custom dropdowns or comboboxes with `role="option"`, always ensure the options have `tabIndex={0}`, visible focus states (e.g., `focus-visible:ring`), and `onKeyDown` handlers that support at least 'Enter' and 'Space' selection.

## 2024-04-02 - Custom interactive elements keyboard accessibility
**Learning:** Custom interactive elements like `<span role="button">` often implement 'Enter' key handling for keyboard navigation but miss the spacebar support (`e.key === ' '`) which standard `<button>` elements have natively. They also frequently lack `focus-visible` states, making keyboard navigation difficult to track visually.
**Action:** Always check custom interactive elements (buttons built with div/span) for both 'Enter' and 'Space' key support, prevent default spacebar scrolling, and ensure visual focus states are implemented.
