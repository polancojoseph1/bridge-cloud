## 2023-10-25 - Missing title tooltips on interactive elements
**Learning:** Many icon-only buttons or buttons lacking textual descriptions in Bridge Cloud were missing `title` attributes (which natively also function as tooltips for sighted users on hover and improve overall a11y context). Although `aria-label` provides screen reader support, `title` should be present to display hover tooltips as per the accessibility coding standards for icon-only components.
**Action:** When adding or updating icon-only buttons or buttons with obscure contexts, always add an appropriate `title` attribute along with any existing `aria-label`.

## 2023-10-25 - Redundant title tooltips on buttons with visible text
**Learning:** Adding a title that matches the explicit text content of a button is an accessibility anti-pattern. It creates redundant visual noise and can cause screen readers to announce the button's purpose twice.
**Action:** Only add `title` attributes to buttons when there isn't already explicit visible text that conveys the same meaning (e.g. icon-only buttons).
