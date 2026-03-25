import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useInstanceStore } from './instanceStore';

vi.mock('zustand/middleware');

describe('useInstanceStore', () => {
  const initialState = useInstanceStore.getState();

  beforeEach(() => {
    useInstanceStore.setState(initialState, true);
  });

  it('should have a default instance', () => {
    const state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(1);
    expect(state.instances[0].instanceId).toBe('default-inst');
    expect(state.activeInstanceId).toBe('default-inst');
    expect(state.activeInstance()).toEqual(state.instances[0]);
  });

  it('should create a new instance and set it as active', () => {
    const { createInstance } = useInstanceStore.getState();
    const newId = createInstance('gpt-4');

    const state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(2);
    expect(state.activeInstanceId).toBe(newId);

    const newInst = state.instances.find(i => i.instanceId === newId);
    expect(newInst).toBeDefined();
    expect(newInst?.agentId).toBe('gpt-4');
    expect(newInst?.label).toBe('chat-2');
    expect(newInst?.conversationId).toBeNull();
  });

  it('should not create more than 8 instances', () => {
    const { createInstance } = useInstanceStore.getState();
    for (let i = 0; i < 10; i++) {
      createInstance('test-agent');
    }
    const state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(8);
  });

  it('should close an instance and update activeInstanceId correctly', () => {
    const { createInstance, closeInstance } = useInstanceStore.getState();
    const id1 = createInstance('agent-1');
    const id2 = createInstance('agent-2');

    let state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(3);
    expect(state.activeInstanceId).toBe(id2);

    // Close the active instance
    closeInstance(id2);
    state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(2);
    expect(state.activeInstanceId).toBe(id1); // Fallback to previous
  });

  it('should not close the last instance', () => {
    const { closeInstance } = useInstanceStore.getState();
    closeInstance('default-inst');

    const state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(1);
  });

  it('should update active instance correctly when closing a non-active instance', () => {
    const { createInstance, closeInstance, setActiveInstance } = useInstanceStore.getState();
    const id1 = createInstance('agent-1');
    const id2 = createInstance('agent-2');

    setActiveInstance(id1);

    closeInstance(id2);
    const state = useInstanceStore.getState();
    expect(state.instances).toHaveLength(2);
    expect(state.activeInstanceId).toBe(id1);
  });

  it('should set active instance', () => {
    const { createInstance, setActiveInstance } = useInstanceStore.getState();
    const newId = createInstance('test-agent');

    setActiveInstance('default-inst');
    const state = useInstanceStore.getState();
    expect(state.activeInstanceId).toBe('default-inst');
  });

  it('should set instance conversation', () => {
    const { setInstanceConversation } = useInstanceStore.getState();
    setInstanceConversation('default-inst', 'conv-123');

    const state = useInstanceStore.getState();
    expect(state.instances[0].conversationId).toBe('conv-123');
  });

  it('should rename instance and slice to 24 chars', () => {
    const { renameInstance } = useInstanceStore.getState();
    const longName = 'This is a very long name that exceeds twenty four characters';
    renameInstance('default-inst', longName);

    const state = useInstanceStore.getState();
    expect(state.instances[0].label).toBe(longName.slice(0, 24));
  });

  it('should set instance agent and generate a new label', () => {
    const { setInstanceAgent } = useInstanceStore.getState();
    setInstanceAgent('default-inst', 'new-agent');

    const state = useInstanceStore.getState();
    expect(state.instances[0].agentId).toBe('new-agent');
    expect(state.instances[0].label).toBe('chat-1');
  });

  it('should generate next available label correctly', () => {
    const { createInstance, setInstanceAgent, closeInstance } = useInstanceStore.getState();
    const id1 = createInstance('agent-1'); // chat-2
    const id2 = createInstance('agent-2'); // chat-3

    let state = useInstanceStore.getState();
    expect(state.instances.find(i => i.instanceId === id1)?.label).toBe('chat-2');
    expect(state.instances.find(i => i.instanceId === id2)?.label).toBe('chat-3');

    closeInstance(id1);

    setInstanceAgent(id2, 'agent-3');

    state = useInstanceStore.getState();
    expect(state.instances.find(i => i.instanceId === id2)?.label).toBe('chat-2');
  });
});

import { instanceStoreOptions } from './instanceStore';

describe('instanceStoreOptions', () => {
  it('should partialize correctly', () => {
    const fullState = {
      instances: [{ instanceId: '1', agentId: 'test', label: 'test', conversationId: null, createdAt: 0, isPinned: false }],
      activeInstanceId: '1',
      activeInstance: () => null,
      createInstance: () => '1',
      closeInstance: () => {},
      setActiveInstance: () => {},
      setInstanceConversation: () => {},
      renameInstance: () => {},
      setInstanceAgent: () => {},
    };

    // @ts-expect-error partializing full state
    const partial = instanceStoreOptions.partialize(fullState);
    expect(partial).toEqual({
      instances: fullState.instances,
      activeInstanceId: '1',
    });
  });

  it('should migrate old state (version < 1)', () => {
    const oldState = {
      instances: [
        { label: 'claude-1' },
        { label: 'gemini-2' },
        { label: 'chat-3' },
      ],
      activeInstanceId: '1',
    };

    const migrated = instanceStoreOptions.migrate(oldState, 0) as any;
    expect(migrated.instances[0].label).toBe('chat-1');
    expect(migrated.instances[1].label).toBe('chat-2');
    expect(migrated.instances[2].label).toBe('chat-3');
  });

  it('should handle onRehydrateStorage', () => {
    const onRehydrate = instanceStoreOptions.onRehydrateStorage();

    const state = {
      instances: [
        { label: 'claude-1' },
        { label: 'chat-2' }
      ]
    } as any;

    onRehydrate(state);
    expect(state.instances[0].label).toBe('chat-1');
    expect(state.instances[1].label).toBe('chat-2');
  });

  it('should not throw when onRehydrateStorage is called with undefined', () => {
    const onRehydrate = instanceStoreOptions.onRehydrateStorage();
    expect(() => onRehydrate(undefined)).not.toThrow();
  });
});

describe('Persist Logic branch coverage', () => {
  it('should not migrate if version >= 1', () => {
    const state = { instances: [{ label: 'claude-1' }] };
    const migrated = instanceStoreOptions.migrate(state, 1) as any;
    expect(migrated.instances[0].label).toBe('claude-1');
  });

  it('should not rehydrate when instances have correct labels', () => {
    const onRehydrate = instanceStoreOptions.onRehydrateStorage();
    const state = { instances: [{ label: 'chat-1' }] } as any;
    const oldInstances = state.instances;
    onRehydrate(state);
    expect(state.instances).toBe(oldInstances);
  });
});

describe('Active Instance Fallbacks and Edge Cases', () => {
  beforeEach(() => { useInstanceStore.setState({ instances: [{ instanceId: 'default-inst', agentId: 'claude', conversationId: null, label: 'chat-1', createdAt: 0, isPinned: false }], activeInstanceId: 'default-inst' }); });
  it('generateLabel fallback', () => {
    // If instance has no matching format
    const { createInstance, renameInstance } = useInstanceStore.getState();
    const id = createInstance('agent');
    renameInstance(id, 'foo');
    // next instance should be chat-2
    const id2 = createInstance('agent2');
    const state = useInstanceStore.getState();
    expect(state.instances.find(i => i.instanceId === id2)?.label).toBe('chat-2');
  });

  it('closeInstance handles active instance not found fallback', () => {
    // If remaining array is missing active instance somehow, this falls to `(remaining[idx - 1] ?? remaining[0]).instanceId;`
    // where idx - 1 might be < 0.
    const { createInstance, closeInstance, setActiveInstance } = useInstanceStore.getState();
    const id1 = createInstance('agent-1');
    const id2 = createInstance('agent-2');

    // So instances are default-inst, agent-1, agent-2
    // If we close default-inst while it's active
    setActiveInstance('default-inst');
    closeInstance('default-inst');
    const state = useInstanceStore.getState();
    // It should fallback to remaining[0] (which is agent-1) because idx was 0, so idx-1 is -1
    expect(state.activeInstanceId).toBe(id1);
  });

  it('activeInstance falls back to first instance if activeInstanceId is not found', () => {
    const { setActiveInstance, activeInstance } = useInstanceStore.getState();
    setActiveInstance('not-found');
    const inst = activeInstance();
    expect(inst).toBeDefined();
    expect(inst?.instanceId).toBe('default-inst');
  });

  it('activeInstance returns null if no instances exist', () => {
    useInstanceStore.setState({ instances: [], activeInstanceId: 'default-inst' });
    const inst = useInstanceStore.getState().activeInstance();
    expect(inst).toBeNull();
  });
});

describe('migrate state undefined', () => {
  it('handles state without instances', () => {
    const state = {};
    const migrated = instanceStoreOptions.migrate(state, 0);
    expect(migrated).toBe(state);
  });
});

describe('edge cases for migrate and hydrate', () => {
  it('does not rehydrate when state.instances is not present', () => {
    const onRehydrate = instanceStoreOptions.onRehydrateStorage();
    const state = {} as any;
    expect(() => onRehydrate(state)).not.toThrow();
  });
});

describe('setInstanceConversation branches', () => {
  beforeEach(() => { useInstanceStore.setState({ instances: [{ instanceId: 'default-inst', agentId: 'claude', conversationId: null, label: 'chat-1', createdAt: 0, isPinned: false }], activeInstanceId: 'default-inst' }); });
  it('does not modify other instances', () => {
    const { createInstance, setInstanceConversation } = useInstanceStore.getState();
    const id1 = createInstance('agent');
    const id2 = createInstance('agent2');

    setInstanceConversation(id1, 'conv-1');
    const state = useInstanceStore.getState();
    expect(state.instances.find(i => i.instanceId === id1)?.conversationId).toBe('conv-1');
    expect(state.instances.find(i => i.instanceId === id2)?.conversationId).toBeNull();
  });

  it('renameInstance does not modify other instances', () => {
    const { createInstance, renameInstance } = useInstanceStore.getState();
    const id1 = createInstance('agent');
    const id2 = createInstance('agent2');

    renameInstance(id1, 'new-name');
    const state = useInstanceStore.getState();
    expect(state.instances.find(i => i.instanceId === id1)?.label).toBe('new-name');
    expect(state.instances.find(i => i.instanceId === id2)?.label).toBe('chat-3');
  });

  it('setInstanceAgent does not modify other instances', () => {
    const { createInstance, setInstanceAgent } = useInstanceStore.getState();
    const id1 = createInstance('agent');
    const id2 = createInstance('agent2');

    setInstanceAgent(id1, 'new-agent');
    const state = useInstanceStore.getState();
    expect(state.instances.find(i => i.instanceId === id1)?.agentId).toBe('new-agent');
    expect(state.instances.find(i => i.instanceId === id2)?.agentId).toBe('agent2');
  });
});
