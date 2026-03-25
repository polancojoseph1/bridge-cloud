## 2024-05-24 - Icon-only Button Accessibility
**Learning:** Icon-only buttons with `title` attributes may not provide sufficient accessibility context. Missing `aria-label`s on interactive elements like close buttons and password visibility toggles creates a frustrating experience for screen reader users.
**Action:** Always ensure all icon-only buttons, especially in modals and forms, have descriptive `aria-label` attributes.
