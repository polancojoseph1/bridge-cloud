## 2024-05-15 - Improve keyboard navigation of form inputs
**Learning:** ConnectForm and AddServerForm inside ServerManageModal don't use actual HTML forms. This means hitting Enter on inputs like URL or API Key won't submit. This is a common accessibility/UX issue where users expect Enter to trigger the main submit action.
**Action:** Wrap form inputs in semantic `<form>` and change the submit button to `type="submit"`. Update handler from `onClick` to `onSubmit`.
