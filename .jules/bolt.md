## 2024-07-07 - Fix React re-rendering issue with Zustand function selector
**Learning:** Subscribing to a getter function reference (`s => s.activeProfile`) bypasses Zustand's reactivity since the function reference never changes. Calling it during render (`()()`) means the component fails to re-render when the underlying active profile data changes.
**Action:** Replace `useStore(s => s.getter)()` with an inline selector like `useStore(s => s.items.find(i => i.id === s.activeId) ?? null)`.
