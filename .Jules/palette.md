## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-05-19 - Duplicate Props and Safe Tooltips
**Learning:** React components (like `SendButton.tsx`) will fail Next.js builds if they contain duplicate JSX attributes (e.g., passing `title` twice). When adding tooltips to buttons with conditional text, use the nullish coalescing operator `??` to combine optional external props with internal defaults (e.g., `title={title ?? (isStreaming ? 'Stop' : 'Send')}`).
**Action:** When adding missing `title` attributes to components that already accept `title` as an optional prop, ensure you merge the prop carefully rather than duplicating the attribute on the HTML element.
