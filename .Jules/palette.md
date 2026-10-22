## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2026-10-22 - Duplicate Props Turbopack Build Error
**Learning:** Adding a duplicate attribute (like `title`) to a JSX element causes Next.js/Turbopack to fail during the build step (`pnpm run build`). When refactoring components to include tooltips, you must check for existing props and combine them intelligently (e.g., `title={title || fallback}`) rather than blindly appending a new `title="..."` prop.
**Action:** Always run `pnpm run build` as part of the final verification step to catch strict JSX compilation errors before submitting a PR.
