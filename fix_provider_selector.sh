cat << 'EOF2' > patch_provider_selector.diff
<<<<<<< SEARCH
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? "provider-listbox" : undefined}
        title={isOrchestrating ? 'Agent selection disabled in orchestration mode' : undefined}
=======
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? "provider-listbox" : undefined}
        aria-label="Select AI provider"
        title={isOrchestrating ? 'Agent selection disabled in orchestration mode' : 'Select AI provider'}
>>>>>>> REPLACE
EOF2
patch src/components/topbar/ProviderSelector.tsx patch_provider_selector.diff
