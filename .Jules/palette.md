## 2024-04-20 - Icon Buttons Tooltip
**Learning:** Icon-only buttons must include a `title` attribute (matching the `aria-label`) to provide a native browser tooltip on hover for sighted users who may not immediately recognize the icon's function.
**Action:** When implementing icon-only buttons, always ensure that both `aria-label` and `title` are provided. Update `IconButton` component to use `label` for both `aria-label` and `title`.
## 2024-06-11 - Chat Input Focus Retention
**Learning:** In chat interfaces where the input is disabled during AI response generation (streaming), native HTML `autoFocus` only works on initial load. Once disabled, the input loses focus completely. Programmatic focus management (e.g., via `useEffect` tracking the streaming state) is essential to return keyboard focus automatically when generation completes, eliminating friction for follow-up messages.
**Action:** Always pair `disabled={isStreaming}` with a reactive refocus mechanism (`useEffect`) in conversational UI text inputs to maintain a seamless, keyboard-only interaction loop.
