## 2024-06-12 - React.memo with Inline Props
**Learning:** Adding `React.memo` to a component doesn't work if the parent component passes inline functions as props (e.g. `onSelect={() => ...}`). This defeats memoization because the function reference changes on every render.
**Action:** Always ensure stable function references (using `useCallback`) when using `React.memo` to optimize child component re-renders.
