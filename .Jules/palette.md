## 2026-04-03 - Popover Menu Accessibility
**Learning:** Interactive items within custom popover menus (like `ServerSwitcherPopover`) can be easily missed for keyboard focus styling when they rely solely on hover states for background changes.
**Action:** Always ensure that menu items map their visual `hover` styles to equivalent `focus-visible` styles (e.g., `hover:bg-[#152219]` paired with `focus-visible:bg-[#152219] focus-visible:outline-none`) so keyboard users get the same visual feedback as mouse users when navigating via Tab.
