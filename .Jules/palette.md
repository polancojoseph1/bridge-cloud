## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-05-01 - Missing ARIA Labels & Titles on Buttons
**Learning:** Throughout the application, many icon-only buttons lacked proper `aria-label` and `title` attributes. It is crucial for screen readers and sighted users to have context.
**Action:** Consistently apply `aria-label` and `title` attributes to all icon-only buttons across all components. Avoid duplicate `title` attributes on a single element.
