# Bridge Cloud Issue Report

Total issues found: 3

1. **Bug: Agent Selector Dropdown UI Duplication/Import Issue**
   - **Component:** `src/components/layout/Sidebar.tsx`, `src/components/topbar/TopBar.tsx`, `src/components/topbar/ProviderSelector.tsx`
   - **What's broken:** The sidebar and topbar were importing a deprecated or misnamed `AgentSelector` component.
   - **Fix applied:** Updated the import paths to correctly use `ProviderSelector`.

2. **Bug: Auto-scroll logic fails when user scrolls up and down**
   - **Component:** `src/components/chat/MessageList.tsx`
   - **What's broken:** Auto-scroll behavior relied on timeout-based programmatic scroll tracking which is unreliable.
   - **Fix applied:** Implemented deterministic scroll tracking using `expectedScrollTopRef` to accurately distinguish user scrolls from programmatic scrolls.

3. **Bug: Orchestration Modes missing connection UI handling**
   - **Component:** `src/components/orchestration/ModePill.tsx`, `src/components/chat/InputBar.tsx`
   - **What's broken:** Orchestration modes UI elements were visible but disconnected from the backend.
   - **Fix applied:** Disabled the ModePill buttons gracefully with a "Coming soon" tooltip and updated the `InputBar` to block input when a non-single mode is selected.
