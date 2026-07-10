1. **Fix Duplicate JSX Attribute Error**:
   - The build failed with `Type error: JSX elements cannot have multiple attributes with the same name.` in `src/components/input/SendButton.tsx` at line 24.
   - The file currently has:
     ```tsx
      title={title}
      aria-label={isStreaming ? 'Stop generating' : 'Send message'}
      title={isStreaming ? 'Stop generating' : 'Send message'}
     ```
   - I need to remove one of the `title` attributes. I'll modify the code to use the dynamic title: `title={isStreaming ? 'Stop generating' : title || 'Send message'}` and remove the duplicate.

2. **Pre-commit Steps**:
   - Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.
