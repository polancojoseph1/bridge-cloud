## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-09-14 - Duplicate Attributes
**Learning:** Duplicate HTML attributes (like `title`) not only cause strict JSX compilers (like Turbopack) to fail, but can also cause unpredictable or redundant announcements in some screen readers.
**Action:** When merging conditional attributes with passed-in props, use nullish coalescing (e.g., `title={title ?? fallback}`) instead of defining the attribute twice.
