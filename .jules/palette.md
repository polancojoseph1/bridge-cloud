## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## 2024-11-02 - Listbox Semantics
**Learning:** Interactive action elements like buttons (e.g., "Manage servers") cannot be placed directly inside a `role="listbox"`. A listbox must strictly contain `role="option"` elements. Placing buttons inside breaks screen reader arrow-key navigation.
**Action:** When a custom select/dropdown contains both selectable options and action buttons, wrap only the options in the `role="listbox"` container and place the action buttons alongside it in the outer dropdown wrapper.
