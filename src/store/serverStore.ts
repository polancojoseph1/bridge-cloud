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
          const index = s.profiles.findIndex(p => p.id === id);
          if (index === -1) return s;
          const profiles = [...s.profiles];
          profiles[index] = { ...profiles[index], ...patch };
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
          // ⚡ Bolt Optimization: Replaced O(N) .map() with targeted O(N) .findIndex() and O(1) mutations for setting default profile to prevent unnecessary object allocations.
          const targetIndex = s.profiles.findIndex(p => p.id === id);
          if (targetIndex === -1) return s;

          const currentIndex = s.profiles.findIndex(p => p.isDefault);
          if (currentIndex === targetIndex) return s;

          const profiles = [...s.profiles];
          if (currentIndex !== -1) {
            profiles[currentIndex] = { ...profiles[currentIndex], isDefault: false };
          }
          profiles[targetIndex] = { ...profiles[targetIndex], isDefault: true };

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
          const index = s.profiles.findIndex(p => p.id === id);
          const profiles = index !== -1 ? [...s.profiles] : s.profiles;
          if (index !== -1) {
            profiles[index] = {
              ...profiles[index],
              lastHealthStatus: result.status,
              lastCheckedAt: Date.now()
            };
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
