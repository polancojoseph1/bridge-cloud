## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2025-02-12 - Duplicate React State in EmptyState UI
**Learning:** Having duplicate identical state and logic (like `value`, `textareaRef`, and submit logic) for the chat input in `EmptyState.tsx` separate from `InputBar.tsx` causes a disconnected and inconsistent UX. It also means improvements to `InputBar.tsx` (like Stop Generation states) are missed when starting a new chat.
**Action:** When a UI component is used in multiple layout states (like a chat input in an empty state vs active chat), always import and reuse the single source of truth component instead of duplicating its logic.
