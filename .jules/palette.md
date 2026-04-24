## 2026-04-03 - Popover Menu Accessibility
**Learning:** Interactive items within custom popover menus (like `ServerSwitcherPopover`) can be easily missed for keyboard focus styling when they rely solely on hover states for background changes.
**Action:** Always ensure that menu items map their visual `hover` styles to equivalent `focus-visible` styles (e.g., `hover:bg-[#152219]` paired with `focus-visible:bg-[#152219] focus-visible:outline-none`) so keyboard users get the same visual feedback as mouse users when navigating via Tab.
## 2026-04-04 - Form Required Input Accessibility\n**Learning:** While form inputs may have proper `htmlFor` and `id` linkages, failing to explicitly mark mandatory fields with both visual indicators (like asterisks) and semantic attributes (`required`, `aria-required`) negatively impacts both sighted users and screen reader users, especially in configuration-heavy modals where validation occurs only on submit.\n**Action:** Always pair visual required indicators (`<span aria-hidden="true">*</span>`) with semantic `required` and `aria-required="true"` attributes on mandatory input fields.
## 2026-04-13 - Native Tooltips for Icon-Only Buttons
**Learning:** Sighted users often struggle to identify the purpose of icon-only buttons if they lack native browser tooltips, even when `aria-label` is present for screen readers.
**Action:** Always include a `title` attribute that perfectly matches the `aria-label` on all icon-only buttons to provide immediate visual feedback on hover.
## 2026-04-14 - Native Tooltips for Interactive Inputs
**Learning:** Icon-only buttons and interactive inputs lacking visible labels (e.g., chat textareas) must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the element's function.
**Action:** Always pair `aria-label` with a matching `title` attribute on interactive elements that do not have a visible text label.
