
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

## 2024-05-19 - [Memoize Array Derivations in Custom Hooks]
**Learning:** Custom hooks that map and return new array or object references on every execution (e.g., `useAgentHealth`) defeat downstream `useMemo` optimizations in components that consume them, causing unnecessary O(N) operations and re-renders on every render cycle.
**Action:** Always wrap dynamically generated arrays or objects returned by custom hooks in `useMemo` tied strictly to their underlying state to maintain referential stability.

## 2024-05-20 - [Optimize Nested Array Traversals in Store Streaming]
**Learning:** In frequently updated Zustand stores (e.g., handling rapid SSE text chunks in chat), executing nested `.map()` operations to find and update a specific message inside a specific conversation causes O(N*M) callback invocations and heavy garbage collection per chunk. This CPU overhead can significantly freeze or delay the React UI thread during streaming.
**Action:** Replace nested `.map()` loops with `.findIndex()` lookups to bail out early or isolate the target, then construct the updated state using shallow array spreading (`[...arr]`) and single index assignment (`newArr[index] = ...`). This guarantees O(N+M) traversal time and significantly reduces memory churning.
