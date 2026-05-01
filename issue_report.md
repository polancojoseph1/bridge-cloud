# Bridge Cloud Issue Report

Total issues found: 3

1. **Bug: Agent Selector Dropdown UI Duplication/Import Issue**
   - **Component:** `src/components/layout/Sidebar.tsx`, `src/components/topbar/TopBar.tsx`, `src/components/topbar/ProviderSelector.tsx`
   - **What's broken:** The sidebar and topbar were importing a deprecated or misnamed `AgentSelector` component, rather than using the correctly implemented `ProviderSelector` which included the server health status and accessibility improvements.
   - **Fix applied:** Updated the import paths in `Sidebar.tsx` and `TopBar.tsx` to correctly import and render `<ProviderSelector />` and removed the duplicated `AgentSelector.tsx` file.

2. **Bug: Auto-scroll logic fails when user scrolls up and down**
   - **Component:** `src/components/chat/MessageList.tsx`
   - **What's broken:** The auto-scroll behavior relied on `isUserScrolledRef.current = distanceToBottom > 30`. It did not explicitly set the value to false when the user scrolls back to the bottom, causing auto-scroll to sometimes break on subsequent messages.
   - **Fix applied:** Replaced the assignment with an explicit `if/else` block to explicitly toggle `isUserScrolledRef.current` to `true` when scrolled up and `false` when scrolled back to the bottom.

3. **Bug: Orchestration Modes missing connection UI handling**
   - **Component:** `src/components/orchestration/ModePill.tsx`, `src/components/chat/InputBar.tsx`
   - **What's broken:** Orchestration modes (broadcast, parallel, pipeline, gather) have UI elements but do not currently connect to the proxy layer, causing potential empty states or errors if selected.
   - **Fix applied:** Verified that non-single orchestration modes are gracefully disabled via `disabled={isDisabled}` and `onClick` handlers, preventing them from being clicked or breaking the UI. `InputBar.tsx` properly blocks input and shows "Coming soon".

*(Note: The Stop button was tested and verified to be properly wired to the AbortController in `chatStore.ts` and correctly aborts the fetch streams.)*
