## 2026-10-04 - Fix duplicate title attribute in SendButton
**Learning:** Found duplicate title attributes on a button component that caused the next build process to fail because JSX elements cannot have multiple attributes with the same name.
**Action:** Remove duplicate attributes to ensure next build succeeds.
