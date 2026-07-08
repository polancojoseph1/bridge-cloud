## YYYY-MM-DD - Initial Journal Create
**Learning:** Found useAgentHealth hook mapping array inside useMemo which is a good pattern. Let's see if we can do something similar or find other components doing O(n) rendering or re-renders.
**Action:** Let's keep exploring.
## YYYY-MM-DD - Zustand selectors returning a function reference
**Learning:** Found components like ServerStatusIndicator using `useServerStore(s => s.activeProfile)()` and ChatView using `useChatStore((s) => s.activeConversation())`. When you use a getter method from Zustand in React components, since the function reference is stable, the React component only subscribes to the function reference itself, breaking reactivity. It won't re-render when the actual state changes unless another state updates.
**Action:** Replace `useStore(s => s.getterMethod)()` with computing and selecting the required state directly within the selector function (e.g., `useStore(s => s.items.find(i => i.id === s.activeId))`). Wait, let's see if we can do this!
**Learning:** We need to replace component-level usage of `store.active...()` with actual selectors, e.g. `const activeConversation = useChatStore(s => s.conversations.find(c => c.id === s.activeConversationId))` and `const activeInstance = useInstanceStore(s => s.instances.find(i => i.instanceId === s.activeInstanceId))`, or maybe just remove the getter methods and use standard selectors in the components. Wait, the getters might be fine inside the store or for imperative `getState()` calls, but they shouldn't be subscribed to within components, as `s => s.activeProfile()` subscribes to the *getter function itself*, not the returned value.
**Action:** Wait, `EmptyState` uses `const store = useChatStore.getState();` and then `store.activeConversation();` which is an imperative call, NOT a hook call, so it's perfectly fine. `ChatView` uses `useInstanceStore((s) => s.activeInstance())` which is a hook call. `ServerStatusIndicator` uses `useServerStore(s => s.activeProfile)()` which is also a hook call to a getter.
**Summary for fixing ServerStatusIndicator and ChatView:**
1. In `src/components/server/ServerStatusIndicator.tsx`:
Replace:
```typescript
const activeProfile = useServerStore(s => s.activeProfile)();
```
With:
```typescript
const activeProfile = useServerStore(s => s.profiles.find(p => p.id === s.activeProfileId) ?? null);
```

2. In `src/components/chat/ChatView.tsx`:
Replace:
```typescript
const activeInstance = useInstanceStore((s) => s.activeInstance());
```
With:
```typescript
const activeInstance = useInstanceStore((s) => s.instances.find(i => i.instanceId === s.activeInstanceId) ?? s.instances[0] ?? null);
```

This ensures we don't subscribe to the stable getter function reference (which won't trigger re-renders properly on inner data mutations) and properly observe changes. It's also an anti-pattern as per Zustand memory:
> Codebase React/Zustand Pattern: Never subscribe to store getter methods directly in React components (e.g., `const item = useStore(s => s.getterMethod)()`). This subscribes to the stable function reference, breaking reactivity and causing stale UI. Instead, compute and select the required state directly within the selector function (e.g., `useStore(s => s.items.find(i => i.id === s.activeId))`).

Let's do this!
