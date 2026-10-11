1. Use `replace_with_git_merge_diff` to modify the `isForbiddenHostname` function in `src/lib/ssrf.ts`.
2. Use `run_in_bash_session` to run `sed -n '70,95p' src/lib/ssrf.ts`.
3. Use `run_in_bash_session` to execute `pnpm test && pnpm run build`.
4. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. Call `submit` to create a PR with the title '🛡️ Sentinel: [HIGH] Fix SSRF bypass via trailing dots and IPv6 normalization' and description.
