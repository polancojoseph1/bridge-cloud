1. **Fix `useServerStore` destructuring in `ServerSwitcherPopover.tsx`**
   - The current code extracts properties via object destructuring: `const { profiles, activeProfileId, connectProfile, openManage } = useServerStore();`
   - This causes the component to re-render whenever *any* state in `serverStore` changes, rather than only when `profiles`, `activeProfileId`, `connectProfile`, or `openManage` change. This is a common performance anti-pattern in Zustand stores as noted in the memory: "Avoid using object destructuring to extract multiple properties from a Zustand store (e.g., `const { a, b } = useStore()`), as it creates a global subscription leading to unnecessary re-renders. Always use individual, targeted selectors (e.g., `const a = useStore(s => s.a)`)."
   - Replace it with individual, targeted selectors.
   - Using `useShallow` from `zustand/react/shallow` is also an option, but standardizing on individual selectors seems preferred based on the directive. Actually, doing it line by line is what `useServerStore(s => s.profiles)` is.

2. **Verify the change**
   - Run tests (`pnpm test`) and build (`pnpm run build`) to ensure the changes are correct and don't introduce regressions.

3. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

4. **Submit PR**
   - Submit a PR with a title formatting like `⚡ Bolt: [performance improvement]` and the required description format.
