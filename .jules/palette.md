## 2024-05-13 - Focus Styles on Input Buttons
**Learning:** Icon-only buttons absolute positioned within inputs (e.g. password visibility toggle) often miss `focus-visible` states, making them inaccessible for keyboard navigation.
**Action:** When adding or fixing absolute positioned icon buttons, ensure they include `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm` (or similar) so users tabbing through forms can see their focus state.
