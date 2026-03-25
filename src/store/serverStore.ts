'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ServerStore, ServerProfile, HealthStatus } from '@/types';
import { checkHealth } from '@/lib/healthCheck';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useServerStore = create<ServerStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      connectionStatus: 'unknown' as HealthStatus,
      isManageModalOpen: false,
      isManageOpen: false,
      manageModalView: 'list' as 'list' | 'add',
      manageTab: 'list' as 'list' | 'add',
      openManage: (view = 'list') => set({ isManageModalOpen: true, isManageOpen: true, manageModalView: view, manageTab: view }),
      closeManage: () => set({ isManageModalOpen: false, isManageOpen: false }),

      activeProfile: () =>
        get().profiles.find(p => p.id === get().activeProfileId) ?? null,

      defaultProfile: () =>
        get().profiles.find(p => p.isDefault) ?? get().profiles[0] ?? null,

      addProfile: (draft) => {
        const id = generateId();
        const isFirst = get().profiles.length === 0;
        const profile: ServerProfile = {
          ...draft,
          id,
          createdAt: Date.now(),
          lastHealthStatus: 'unknown',
          lastCheckedAt: null,
          isDefault: draft.isDefault || isFirst,
        };
        set(s => {
          const profiles = draft.isDefault || isFirst
            ? s.profiles.map(p => ({ ...p, isDefault: false })).concat(profile)
            : [...s.profiles, profile];
          return { profiles };
        });
        return id;
      },

      updateProfile: (id, patch) => {
        set(s => ({
          profiles: s.profiles.map(p => p.id === id ? { ...p, ...patch } : p),
        }));
      },

      removeProfile: (id) => {
        const { profiles, activeProfileId } = get();
        const remaining = profiles.filter(p => p.id !== id);
        const newActive = activeProfileId === id
          ? (remaining.find(p => p.isDefault)?.id ?? remaining[0]?.id ?? null)
          : activeProfileId;
        // Ensure at least one default
        const updated = remaining.length > 0 && !remaining.some(p => p.isDefault)
          ? remaining.map((p, i) => ({ ...p, isDefault: i === 0 }))
          : remaining;
        set({ profiles: updated, activeProfileId: newActive });
      },

      setDefault: (id) => {
        set(s => ({
          profiles: s.profiles.map(p => ({ ...p, isDefault: p.id === id })),
        }));
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      connectProfile: async (id) => {
        const profile = get().profiles.find(p => p.id === id);
        if (!profile || !profile.url || profile.url.trim() === '') return 'offline';

        set({ connectionStatus: 'checking' });
        const result = await checkHealth(profile.url, profile.apiKey);

        set(s => ({
          connectionStatus: result.status,
          activeProfileId: result.status === 'online' ? id : s.activeProfileId,
          profiles: s.profiles.map(p =>
            p.id === id
              ? { ...p, lastHealthStatus: result.status, lastCheckedAt: Date.now() }
              : p
          ),
        }));

        return result.status;
      },
    }),
    {
      name: 'bridge-cloud-servers',
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);
