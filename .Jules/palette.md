## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-11-20 - Add missing focus rings to interactive buttons
**Learning:** Found several buttons (icon-only toggles, error state CTAs, and secondary list actions) lacking standard keyboard focus indicators, which degrades accessibility for keyboard navigators.
**Action:** Always ensure any interactive <button> uses focus-visible classes, specifically tailoring ring color to the context (e.g., #10a37f for primary actions, #6c8cff for general interactive elements).
