'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ServerStore, ServerProfile, HealthStatus } from '@/types';
import { checkHealth } from '@/lib/healthCheck';
import { generateId } from '@/lib/utils';

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
        set(s => {
          // ⚡ Bolt Optimization: Replace .map with .findIndex for targeted index mutation to avoid O(N) traversal and reduce GC churn
          const idx = s.profiles.findIndex(p => p.id === id);
          if (idx === -1) return s;
          const profiles = [...s.profiles];
          profiles[idx] = { ...profiles[idx], ...patch };
          return { profiles };
        });
      },

      removeProfile: (id) => {
        const { profiles, activeProfileId } = get();
        let defaultId: string | null = null;
        let fallbackActiveId: string | null = null;

        // ⚡ Bolt: Replace multiple array traversals (.filter, .find, .some, .map)
        // with a single .reduce pass to prevent O(N) memory allocations and reduce React GC pauses.
        const updated = profiles.reduce<ServerProfile[]>((acc, p) => {
          if (p.id !== id) {
            if (p.isDefault) defaultId = p.id;
            if (!fallbackActiveId) fallbackActiveId = p.id; // Store first available as fallback
            acc.push(p);
          }
          return acc;
        }, []);

        if (updated.length > 0 && !defaultId) {
          updated[0] = { ...updated[0], isDefault: true };
          defaultId = updated[0].id;
        }

        const newActive = activeProfileId === id
          ? (defaultId ?? fallbackActiveId)
          : activeProfileId;

        set({ profiles: updated, activeProfileId: newActive });
      },

      setDefault: (id) => {
        set(s => {
          // ⚡ Bolt Optimization: Replace .map with .findIndex for targeted index mutation to avoid O(N) traversal and reduce GC churn
          const prevDefaultIdx = s.profiles.findIndex(p => p.isDefault);
          const newDefaultIdx = s.profiles.findIndex(p => p.id === id);

          if (newDefaultIdx === -1) return s;

          const profiles = [...s.profiles];
          if (prevDefaultIdx !== -1 && prevDefaultIdx !== newDefaultIdx) {
            profiles[prevDefaultIdx] = { ...profiles[prevDefaultIdx], isDefault: false };
          }
          profiles[newDefaultIdx] = { ...profiles[newDefaultIdx], isDefault: true };

          return { profiles };
        });
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      connectProfile: async (id) => {
        const profile = get().profiles.find(p => p.id === id);
        if (!profile || !profile.url || profile.url.trim() === '') return 'offline';

        set({ connectionStatus: 'checking' });
        const result = await checkHealth(profile.url, profile.apiKey);

        set(s => {
          // ⚡ Bolt Optimization: Replace .map with .findIndex for targeted index mutation to avoid O(N) traversal and reduce GC churn
          const idx = s.profiles.findIndex(p => p.id === id);
          const profiles = [...s.profiles];
          if (idx !== -1) {
            profiles[idx] = { ...profiles[idx], lastHealthStatus: result.status, lastCheckedAt: Date.now() };
          }

          return {
            connectionStatus: result.status,
            activeProfileId: result.status === 'online' ? id : s.activeProfileId,
            profiles,
          };
        });

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
