## 2024-05-28 - Keyboard accessibility for custom dropdowns
**Learning:** Custom dropdown components like `ProviderSelector` and `AgentSelector` were using `<div role="option">` but lacked proper keyboard support. While they worked for mouse users, keyboard users could not tab to the options or select them with Enter/Space.
**Action:** When implementing custom dropdowns or comboboxes with `role="option"`, always ensure the options have `tabIndex={0}`, visible focus states (e.g., `focus-visible:ring`), and `onKeyDown` handlers that support at least 'Enter' and 'Space' selection.

## 2024-05-29 - Consistent focus-visible for popover buttons
**Learning:** Menu items and buttons inside custom popovers (like `ServerSwitcherPopover`) often rely on `hover` states for visual feedback but neglect `focus-visible` states, making them invisible to keyboard users navigating via Tab.
**Action:** Always map hover styles to `focus-visible` equivalents (e.g. `hover:bg-[#152219]` -> `focus-visible:bg-[#152219] focus-visible:outline-none`) for internal popover/menu buttons to ensure keyboard navigation visibility.

## 2024-04-02 - Custom interactive elements keyboard accessibility
**Learning:** Custom interactive elements like `<span role="button">` often implement 'Enter' key handling for keyboard navigation but miss the spacebar support (`e.key === ' '`) which standard `<button>` elements have natively. They also frequently lack `focus-visible` states, making keyboard navigation difficult to track visually.
**Action:** Always check custom interactive elements (buttons built with div/span) for both 'Enter' and 'Space' key support, prevent default spacebar scrolling, and ensure visual focus states are implemented.
## 2026-04-10 - Add focus-visible to toggle buttons
**Learning:** Header toggle buttons might be missing proper visual focus states, making keyboard navigation difficult for users.
**Action:** Always ensure interactive elements like buttons have explicit  styles mapped to them (e.g. ) to provide clear visual feedback to keyboard users.
## 2024-05-30 - Add focus-visible to toggle buttons
**Learning:** Header toggle buttons might be missing proper visual focus states, making keyboard navigation difficult for users.
**Action:** Always ensure interactive elements like buttons have explicit `focus-visible` styles mapped to them (e.g. `focus-visible:ring-2`) to provide clear visual feedback to keyboard users.
