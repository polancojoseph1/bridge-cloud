1. **Optimize single-item updates in `src/store/instanceStore.ts` to avoid `.map()`**
   - Identify updaters (`setInstanceConversation`, `renameInstance`, `setInstanceAgent`) that use `.map()` to update a single target instance.
   - Replace these `.map()` calls with a `.findIndex()` lookup.
   - Include an early return if the item is not found (`if (idx === -1) return s;`) to avoid unnecessary re-renders.
   - Use array spreading (`[...s.instances]`) to shallow copy, and selectively mutate the targeted index, thereby avoiding cloning unmodified items.
   - Add a brief comment explaining the "Bolt Optimization".

2. **Verify changes and run tests**
   - Run `pnpm test` (or `pnpm test src/store/instanceStore.test.ts`) to ensure existing tests still pass and there are no regressions.

3. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

4. **Submit Pull Request**
   - Commit the changes and open a PR formatted as requested: "⚡ Bolt: [performance improvement]".
