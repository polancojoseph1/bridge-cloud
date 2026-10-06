## 2024-10-06 - Avoid Redundant aria-label
**Learning:** Adding `aria-label` to buttons that already have visible text content (e.g., `<button aria-label="Log in">Log in</button>`) is redundant. Browsers automatically compute the accessible name from a standard `<button>`'s text content. `aria-label` should ideally be reserved for icon-only buttons or situations where the visible text lacks necessary context.
**Action:** Only use `aria-label` when a button is icon-only or lacks adequate text.
