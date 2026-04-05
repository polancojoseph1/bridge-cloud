## 2026-04-03 - Popover Menu Accessibility
**Learning:** Interactive items within custom popover menus (like `ServerSwitcherPopover`) can be easily missed for keyboard focus styling when they rely solely on hover states for background changes.
**Action:** Always ensure that menu items map their visual `hover` styles to equivalent `focus-visible` styles (e.g., `hover:bg-[#152219]` paired with `focus-visible:bg-[#152219] focus-visible:outline-none`) so keyboard users get the same visual feedback as mouse users when navigating via Tab.

## 2025-01-20 - Ensure required form fields are visually and semantically marked
**Learning:** Form inputs that are conditionally mandatory (like server URL and API key) often lack clear visual markers (like an asterisk) and semantic attributes (`required`, `aria-required="true"`), causing accessibility barriers and user confusion. Password toggle buttons also frequently lack `focus-visible` styling, making keyboard navigation difficult.
**Action:** When creating or updating form inputs, ensure mandatory fields include an `aria-hidden="true"` asterisk in the label and the `required`/`aria-required="true"` attributes on the input element. Also, guarantee all interactive elements like icon buttons have explicit `focus-visible` outline styles.
