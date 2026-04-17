## 2024-04-17 - Avoid `role="menu"` on native button popovers without arrow-key support
**Learning:** Adding `role="menu"` and `role="menuitem"` to a container of native `<button>` elements (like `ServerSwitcherPopover`) without implementing full up/down arrow-key navigation is an accessibility anti-pattern. Native buttons are naturally accessible via the `Tab` key, but setting them as `menuitem` instructs screen readers to expect arrow-key navigation. If this isn't implemented, the experience is broken.
**Action:** Rely on native `Tab` accessibility for popovers containing buttons. Only use `role="menu"` and `role="menuitem"` when explicitly building a custom dropdown that implements full keyboard arrow navigation.

## 2024-04-17 - Add `title` to icon-only buttons
**Learning:** Icon-only buttons (like a trash can for delete, or an eye for show password) are often confusing to sighted users who may not understand the icon's intent. While `aria-label` helps screen readers, sighted users need a native browser tooltip.
**Action:** Always add a `title` attribute that matches the `aria-label` to icon-only buttons to provide a helpful native tooltip on hover.
