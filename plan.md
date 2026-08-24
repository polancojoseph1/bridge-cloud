1. **Modify `src/components/server/ServerManageModal.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
            <button
              onClick={() => setConfirmDelete({ profileId: null })}
              className="px-3 py-1 rounded-md text-[12px] text-[#8e8e8e] bg-[#1e3025] hover:bg-[#2d4035] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded-md text-[12px] font-medium text-[#fca5a5] bg-[rgba(239,68,68,0.10)] hover:bg-[rgba(239,68,68,0.18)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]"
            >
              Delete
            </button>
=======
            <button
              onClick={() => setConfirmDelete({ profileId: null })}
              title="Cancel"
              aria-label="Cancel"
              className="px-3 py-1 rounded-md text-[12px] text-[#8e8e8e] bg-[#1e3025] hover:bg-[#2d4035] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              title="Confirm delete"
              aria-label="Confirm delete"
              className="px-3 py-1 rounded-md text-[12px] font-medium text-[#fca5a5] bg-[rgba(239,68,68,0.10)] hover:bg-[rgba(239,68,68,0.18)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]"
            >
              Delete
            </button>
>>>>>>> REPLACE
```

2. **Modify `src/components/server/ServerManageModal.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
        <button
          onClick={onAddServer}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410] text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c15]"
        >
          <Plus size={15} />
          Connect your first server
        </button>
=======
        <button
          onClick={onAddServer}
          title="Connect your first server"
          aria-label="Connect your first server"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410] text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c15]"
        >
          <Plus size={15} />
          Connect your first server
        </button>
>>>>>>> REPLACE
```

3. **Modify `src/components/server/ServerGate.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-[#8e8e8e] hover:text-[#ececec] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-medium bg-[#1e3025] hover:bg-[#2a4334] text-[#ececec] px-3 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
              Sign up
            </button>
          </SignUpButton>
        </Show>
=======
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button title="Log in" aria-label="Log in" className="text-sm font-medium text-[#8e8e8e] hover:text-[#ececec] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button title="Sign up" aria-label="Sign up" className="text-sm font-medium bg-[#1e3025] hover:bg-[#2a4334] text-[#ececec] px-3 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
              Sign up
            </button>
          </SignUpButton>
        </Show>
>>>>>>> REPLACE
```

4. **Modify `src/components/server/ServerGate.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
        {/* Local card */}
        <button
          onClick={onLocalSelect}
          className="flex-1 text-left p-6 rounded-xl bg-[#0e1c14] border border-[#2d4035] hover:border-[#3d5548] hover:bg-[#152219] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
        >
=======
        {/* Local card */}
        <button
          onClick={onLocalSelect}
          title="Connect your own server"
          aria-label="Connect your own server"
          className="flex-1 text-left p-6 rounded-xl bg-[#0e1c14] border border-[#2d4035] hover:border-[#3d5548] hover:bg-[#152219] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
        >
>>>>>>> REPLACE
```

5. **Modify `src/components/server/ServerGate.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
          <Show when="signed-out">
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="flex-1 py-2 text-[13px] font-medium text-[#8e8e8e] bg-[#152219] border border-[#2d4035] hover:text-[#ececec] hover:border-[#3d5548] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 py-2 text-[13px] font-medium text-[#0a1410] bg-[#10a37f] hover:bg-[#0d8f6f] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1c14]">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <button
              onClick={onCloudSelect}
              className="w-full py-2 text-[13px] font-medium text-[#0a1410] bg-[#10a37f] hover:bg-[#0d8f6f] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1c14]"
            >
              Connect to Cloud →
            </button>
          </Show>
=======
          <Show when="signed-out">
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button title="Log in" aria-label="Log in" className="flex-1 py-2 text-[13px] font-medium text-[#8e8e8e] bg-[#152219] border border-[#2d4035] hover:text-[#ececec] hover:border-[#3d5548] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button title="Sign up" aria-label="Sign up" className="flex-1 py-2 text-[13px] font-medium text-[#0a1410] bg-[#10a37f] hover:bg-[#0d8f6f] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1c14]">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <button
              onClick={onCloudSelect}
              title="Connect to Cloud"
              aria-label="Connect to Cloud"
              className="w-full py-2 text-[13px] font-medium text-[#0a1410] bg-[#10a37f] hover:bg-[#0d8f6f] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1c14]"
            >
              Connect to Cloud →
            </button>
          </Show>
>>>>>>> REPLACE
```

6. **Modify `src/components/topbar/ProviderSelector.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
          <div className="border-t border-[#1e3025] mt-1 pt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); openManage('list'); }}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#1a1a1a] transition-colors rounded-md mx-1 w-[calc(100%-8px)] focus-visible:bg-[#1a1a1a] focus-visible:text-[#9b9b9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage servers
            </button>
          </div>
=======
          <div className="border-t border-[#1e3025] mt-1 pt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); openManage('list'); }}
              title="Manage servers"
              aria-label="Manage servers"
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#1a1a1a] transition-colors rounded-md mx-1 w-[calc(100%-8px)] focus-visible:bg-[#1a1a1a] focus-visible:text-[#9b9b9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage servers
            </button>
          </div>
>>>>>>> REPLACE
```

7. **Modify `src/components/instance/NewInstancePicker.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
      {onlineAgents.map(agent => (
        <button
          key={agent.id}
          type="button"
          onClick={() => { createInstance(agent.id); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-[#ececec] hover:bg-[#1e3025] transition-colors text-left"
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: agent.dotColor }} />
          {agent.name}
        </button>
      ))}
=======
      {onlineAgents.map(agent => (
        <button
          key={agent.id}
          type="button"
          onClick={() => { createInstance(agent.id); onClose(); }}
          title={agent.name}
          aria-label={agent.name}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-[#ececec] hover:bg-[#1e3025] transition-colors text-left"
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: agent.dotColor }} />
          {agent.name}
        </button>
      ))}
>>>>>>> REPLACE
```

8. **Modify `src/components/orchestration/NodeTray.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
          {/* Add server CTA */}
          <button
            type="button"
            onClick={() => openManage('add')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#2d4035] text-[12px] text-[#3c5c48] hover:text-[#6c8cff] hover:border-[#6c8cff] transition-colors duration-150"
          >
            <Plus className="w-3 h-3" />
            Add server
          </button>
=======
          {/* Add server CTA */}
          <button
            type="button"
            onClick={() => openManage('add')}
            title="Add server"
            aria-label="Add server"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#2d4035] text-[12px] text-[#3c5c48] hover:text-[#6c8cff] hover:border-[#6c8cff] transition-colors duration-150"
          >
            <Plus className="w-3 h-3" />
            Add server
          </button>
>>>>>>> REPLACE
```

9. **Modify `src/components/instance/InstanceTabBar.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
      <button type="button" onClick={() => setActive(instanceId)} className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? dotColor : '#3c3c3c' }} />
        <span>{instance.label}</span>
      </button>
=======
      <button type="button" onClick={() => setActive(instanceId)} title={instance.label} aria-label={instance.label} className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? dotColor : '#3c3c3c' }} />
        <span>{instance.label}</span>
      </button>
>>>>>>> REPLACE
```

10. **Modify `src/components/instance/InstanceTabBar.tsx` using `replace_with_git_merge_diff`**:
```
<<<<<<< SEARCH
  return (
    <button
      type="button"
      data-instance-id={instanceId}
      onClick={() => setActive(instanceId)}
      className={cn(
        'group flex items-center gap-1.5 px-3 h-full flex-shrink-0 relative',
        'text-[12px] font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#6c8cff]',
        isActive
          ? 'text-[#ececec] bg-[#111f15]'
          : 'text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#0d1a11]'
      )}
    >
=======
  return (
    <button
      type="button"
      data-instance-id={instanceId}
      onClick={() => setActive(instanceId)}
      title={instance.label}
      aria-label={instance.label}
      className={cn(
        'group flex items-center gap-1.5 px-3 h-full flex-shrink-0 relative',
        'text-[12px] font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#6c8cff]',
        isActive
          ? 'text-[#ececec] bg-[#111f15]'
          : 'text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#0d1a11]'
      )}
    >
>>>>>>> REPLACE
```

11. **Write to journal**: Create/append to `.Jules/palette.md` using `echo` with the following learning:
```
## $(date +%Y-%m-%d) - Interactive Element Accessibility
**Learning:** Even buttons with visible text benefit from explicit `aria-label` and `title` attributes for improved screen reader context and native browser tooltips.
**Action:** When creating text-based interactive elements, evaluate if adding `aria-label` and `title` would enhance context for assistive technologies.
```

12. **Verify changes**: Verify the files were successfully updated by using `run_in_bash_session` to execute `pnpm test && pnpm run build`.

13. **Complete pre-commit steps**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

14. **Submit PR**: Submit the PR using `submit` with `branch_name="palette/add-missing-button-titles"`, `title="🎨 Palette: Add titles and aria-labels to buttons"`, `commit_message="Add title and aria-label attributes to various buttons"`, and `description="💡 What: Added missing title and aria-label attributes to several interactive buttons across the application.\n🎯 Why: To improve keyboard navigation, screen reader context, and provide native tooltips for sighted users.\n📸 Before/After: N/A (non-visual change)\n♿ Accessibility: Enhanced ARIA labels provide explicit context to screen readers, while title attributes provide tooltip feedback on hover."`.
