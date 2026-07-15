## 2024-05-17 - Inline Two-Step Confirmation
**Learning:** For destructive actions in dense lists like chat histories, traditional modal dialogs are overly disruptive and slow down the user flow, while immediate deletion is prone to misclicks.
**Action:** Use an inline two-step confirmation pattern (e.g., clicking a trash icon turns it into a checkmark, requiring a second click to confirm). Reset the confirmation state on a timeout or when the mouse leaves the item area.
