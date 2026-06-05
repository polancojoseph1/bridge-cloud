
## 2026-06-05 - Duplicate JSX Attributes Break Next.js Build
**Learning:** Next.js production builds via `next build` are extremely strict and will fail on TypeScript/JSX errors that might be silent during `next dev`. For example, having duplicate `title` attributes on a JSX element (like in `SendButton.tsx`) causes a fatal "Type error: JSX elements cannot have multiple attributes with the same name."
**Action:** Always run `npm run build` locally after making changes, especially refactors, to ensure strict JSX/TypeScript checks pass, rather than just relying on `npm test` or dev servers.
