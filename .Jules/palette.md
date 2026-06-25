## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-04-21 - Textarea autoFocus
**Learning:** In chat-based interfaces (like EmptyState or InputBar), adding `autoFocus` to the primary `<textarea>` is a critical accessibility and UX pattern. It allows users to begin typing immediately upon page load without an extra click.
**Action:** Always ensure the primary input mechanism in a chat interface includes the `autoFocus` property to reduce initial interaction friction.
