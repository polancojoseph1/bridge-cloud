
## 2024-03-27 - [Array Filtering Optimization]
**Learning:** In frequently polling React components (like `ProviderSelector` handling health checks), replacing `const a = arr.filter(f1); const b = arr.filter(f2);` with a single `.reduce` pass to partition the arrays halves the O(N) traversal time and significantly reduces memory allocations and garbage collection pauses.
**Action:** Always prefer `reduce` for partitioning arrays in high-frequency render paths instead of using multiple `filter` calls.

## 2024-05-14 - [React.useMemo for Array Partitions]
**Learning:** In frequently polling React components (like `NewInstancePicker` handling health checks), even if array partitioning is optimized to O(N) using `reduce`, doing this on every render cycle when the underlying data hasn't changed still causes unnecessary CPU churn and memory allocations.
**Action:** Always wrap expensive or allocation-heavy array derivations (like `reduce` partitions) in `useMemo` within frequently re-rendering components, tying the dependency strictly to the source array.

## 2024-05-15 - [Optimize Store Array Traversals]
**Learning:** In Zustand stores, chaining multiple array methods (`.filter`, `.findIndex`, `.some`, `.map`, `.find`) creates unnecessary O(N) intermediate allocations, leading to memory bloat and garbage collection pauses when managing active components like UI tabs or dropdowns. Additionally, when using `.reduce` to construct an updated state array, directly mutating objects (e.g. `updated[0].isDefault = true`) breaks React's shallow equality checks causing missing re-renders.
**Action:** Replace multiple chained array traversals with a single `for` loop or `.reduce()` pass when mutating store collections. Always preserve immutability by shallow copying specific updated objects (e.g., `updated[0] = { ...updated[0], isDefault: true }`).

## 2026-04-01 - [Zustand Targeted Selectors in Arrays]
**Learning:** In React components (like `MessageList.tsx`) that extract a specific item from a Zustand store array via its ID, subscribing to the entire array and doing `.find(c => c.id === id)` locally causes the component to re-render for ANY mutation to that array (e.g., when another conversation's title updates), leading to massive O(N) re-render overhead during high-frequency events like streaming.
**Action:** Always use a targeted selector wrapped in `useCallback` when selecting specific items from a store array: `useStore(useCallback(s => s.array.find(item => item.id === id), [id]))`. This ensures the component only re-renders when the specific object reference changes.

## 2024-05-16 - [Memoize Expensive O(N) Reductions and Traversals]
**Learning:** In frequently rendering components (like `NodeTray.tsx` which reacts to orchestration or server status changes), array length derivations (e.g. `onlineCount`) and data filtering maps (e.g. `orderedNodes`) that rely on chained array traversals (`.map().filter()`) or sequential `.reduce` cause O(N) operations and garbage collection churn on *every* render cycle, even when the underlying dependencies haven't changed.
**Action:** Always wrap expensive derivations and partitions in `useMemo` strictly tied to their source data and replace chained traversals (`.map(...).filter(...)`) with a single, memoized `.reduce(...)` pass.

## 2025-05-18 - [ReactMarkdown Inline Objects in Streaming]
**Learning:** In highly active components like `MarkdownRenderer` that receive rapidly streaming text (up to 60fps), defining the `components={{ ... }}` object and `remarkPlugins={[...]}` array inline forces React to destroy and recreate the entire Markdown DOM tree on every chunk because the plugin and component prop references change on every render cycle. This causes massive unnecessary CPU churn and garbage collection pauses.
**Action:** Always extract static objects like `components` and `remarkPlugins` arrays outside of the `ReactMarkdown` component function, and wrap the component itself in `React.memo()`.
