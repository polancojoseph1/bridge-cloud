'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Instance, InstanceStore } from '@/types';
import { generateId } from '@/lib/utils';

function generateLabel(_agentId: string, instances: Instance[]): string {
  const nums = instances
    .map(i => { const m = i.label.match(/-(\d+)$/); return m ? parseInt(m[1]) : 0; });
  const next = nums.length === 0 ? 1 : Math.max(...nums) + 1;
  return `chat-${next}`;
}

const DEFAULT_INSTANCE_ID = 'default-inst';

export const instanceStoreOptions = {
  name: 'bridge-cloud-instances',
  version: 1,
  skipHydration: true,
  partialize: (state: InstanceStore) => ({ instances: state.instances, activeInstanceId: state.activeInstanceId }),
  migrate: (persistedState: unknown, version: number) => {
    const state = persistedState as { instances: Instance[]; activeInstanceId: string | null };
    if (version < 1 && state.instances) {
      // Rename old agentId-prefixed labels (e.g. "claude-1", "gemini-2") → "chat-N"
      state.instances = state.instances.map(i => ({
        ...i,
        label: i.label.replace(/^(claude|gemini|codex|qwen|free)-(\d+)$/, 'chat-$2'),
      }));
    }
    return state;
  },
  onRehydrateStorage: () => (state?: InstanceStore) => {
    // Belt-and-suspenders: rename old labels even if migrate didn't fire
    if (state?.instances) {
      const renamed = state.instances.map(i => ({
        ...i,
        label: i.label.replace(/^(claude|gemini|codex|qwen|free)-(\d+)$/, 'chat-$2'),
      }));
      if (renamed.some((i, idx) => i.label !== state.instances[idx].label)) {
        state.instances = renamed;
      }
    }
  },
};

export const useInstanceStore = create<InstanceStore>()(
  persist(
    (set, get) => ({
      instances: [{
        instanceId: DEFAULT_INSTANCE_ID,
        agentId: 'claude',
        conversationId: null,
        label: 'chat-1',
        createdAt: 0,
        isPinned: false,
      }],
      activeInstanceId: DEFAULT_INSTANCE_ID,

      activeInstance: () => {
        const { instances, activeInstanceId } = get();
        return instances.find(i => i.instanceId === activeInstanceId) ?? instances[0] ?? null;
      },

      createInstance: (agentId: string) => {
        const { instances } = get();
        if (instances.length >= 8) return instances[0].instanceId;
        const instanceId = generateId();
        const label = generateLabel(agentId, instances);
        const inst: Instance = { instanceId, agentId, conversationId: null, label, createdAt: Date.now(), isPinned: false };
        set(s => ({ instances: [...s.instances, inst], activeInstanceId: instanceId }));
        return instanceId;
      },

      closeInstance: (instanceId: string) => {
        set(s => {
          const remaining: Instance[] = [];
          let targetIdx = -1;

          // ⚡ Bolt: Replace double traversal (.filter + .findIndex) with a single pass
          for (let i = 0; i < s.instances.length; i++) {
            const inst = s.instances[i];
            if (inst.instanceId === instanceId) {
              targetIdx = i;
            } else {
              remaining.push(inst);
            }
          }

          if (remaining.length === 0) return s;

          const wasActive = s.activeInstanceId === instanceId;
          let newActiveId = s.activeInstanceId;

          if (wasActive && targetIdx !== -1) {
            newActiveId = (remaining[targetIdx - 1] ?? remaining[0]).instanceId;
          }

          return { instances: remaining, activeInstanceId: newActiveId };
        });
      },

      setActiveInstance: (instanceId: string) => set({ activeInstanceId: instanceId }),

      setInstanceConversation: (instanceId: string, conversationId: string) => {
        set(s => {
          const idx = s.instances.findIndex(i => i.instanceId === instanceId);
          if (idx === -1) return s;
          const instances = [...s.instances];
          instances[idx] = { ...instances[idx], conversationId };
          return { instances };
        });
      },

      renameInstance: (instanceId: string, label: string) => {
        set(s => {
          const idx = s.instances.findIndex(i => i.instanceId === instanceId);
          if (idx === -1) return s;
          const instances = [...s.instances];
          instances[idx] = { ...instances[idx], label: label.slice(0, 24) };
          return { instances };
        });
      },

      setInstanceAgent: (instanceId: string, agentId: string) => {
        set(s => {
          const idx = s.instances.findIndex(i => i.instanceId === instanceId);
          if (idx === -1) return s;

          const remaining: Instance[] = [];
          for (let i = 0; i < s.instances.length; i++) {
            if (i !== idx) {
              remaining.push(s.instances[i]);
            }
          }

          const newLabel = generateLabel(agentId, remaining);
          const instances = [...s.instances];
          instances[idx] = { ...instances[idx], agentId, label: newLabel };

          return { instances };
        });
      },
    }),
    instanceStoreOptions
  )
);
