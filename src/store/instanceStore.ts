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
          const remaining = s.instances.filter(i => i.instanceId !== instanceId);
          if (remaining.length === 0) return s;
          const wasActive = s.activeInstanceId === instanceId;
          let newActiveId = s.activeInstanceId;
          if (wasActive) {
            const idx = s.instances.findIndex(i => i.instanceId === instanceId);
            newActiveId = (remaining[idx - 1] ?? remaining[0]).instanceId;
          }
          return { instances: remaining, activeInstanceId: newActiveId };
        });
      },

      setActiveInstance: (instanceId: string) => set({ activeInstanceId: instanceId }),

      setInstanceConversation: (instanceId: string, conversationId: string) => {
        set(s => ({
          instances: s.instances.map(i => i.instanceId === instanceId ? { ...i, conversationId } : i),
        }));
      },

      renameInstance: (instanceId: string, label: string) => {
        set(s => ({
          instances: s.instances.map(i => i.instanceId === instanceId ? { ...i, label: label.slice(0, 24) } : i),
        }));
      },

      setInstanceAgent: (instanceId: string, agentId: string) => {
        set(s => {
          const newLabel = generateLabel(agentId, s.instances.filter(i => i.instanceId !== instanceId));
          return {
            instances: s.instances.map(i =>
              i.instanceId === instanceId ? { ...i, agentId, label: newLabel } : i
            ),
          };
        });
      },
    }),
    {
      name: 'bridge-cloud-instances',
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ instances: state.instances, activeInstanceId: state.activeInstanceId }),
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
      onRehydrateStorage: () => (state) => {
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
    }
  )
);
