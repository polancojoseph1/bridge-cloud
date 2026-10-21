## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.

## $(date +%Y-%m-%d) - Accessible Labels for Server Switcher Popover
**Learning:** Complex interactive elements within popovers (like dynamically generated profile buttons or action buttons) often lack accessible names if they only contain icons or non-descriptive text ("Local"). Screen reader users need explicit `aria-label` context to understand what connection they are establishing.
**Action:** Always ensure action buttons within drop-downs/popovers are fully labeled using `aria-label` and `title` attributes that describe the action ("Connect to [Profile Name]").
