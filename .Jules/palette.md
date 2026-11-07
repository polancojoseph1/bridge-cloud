## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-11-07 - Disabled Tooltips & Shortcuts
**Learning:** Users often don't understand why a submit button is disabled. Adding a tooltip that explains the required action (e.g., "Enter a message to send") alongside keyboard shortcut hints when enabled ("Send message (Enter)") significantly improves clarity and discoverability without cluttering the UI.
**Action:** When implementing primary action buttons, always provide dynamic `title` tooltips that explicitly explain the disabled state and include keyboard shortcuts for the enabled state.
