## 2026-10-15 - Fix duplicate title attribute and build error
**Learning:** React JSX does not allow duplicate attributes on an element. The `SendButton` component had two `title` attributes: one for the optional tooltip string, and one dynamically changing to "Stop generating" / "Send message".
**Action:** Remove the hardcoded dynamic title string and just use the `title` prop which gets passed the "Stop generating" / "Send message" text, or fallback to the dynamic text if `title` is not provided.
