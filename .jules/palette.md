## $(date +%Y-%m-%d) - Focus States and ARIA labels for UI Elements
**Learning:** Adding subtle \`focus-visible:ring-2\` highlights to scroll controls and list components significantly improves keyboard navigability, while dynamic \`title\` tags on disabled elements (like "Enter a message to send") make UI states clearer without requiring ARIA-live regions.
**Action:** Always include \`focus-visible\` utility classes for custom interactive elements and conditionally apply helpful fallback \`title\` strings to disabled icon-only buttons to immediately convey UI intent.
