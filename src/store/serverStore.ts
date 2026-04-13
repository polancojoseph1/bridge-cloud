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
          // ⚡ Bolt Optimization: Replace O(N) array mapping with single target update or simple append
          if (draft.isDefault || isFirst) {
            const newProfiles = [...s.profiles];
            for (let i = 0; i < newProfiles.length; i++) {
              if (newProfiles[i].isDefault) {
                newProfiles[i] = { ...newProfiles[i], isDefault: false };
              }
            }
            newProfiles.push(profile);
            return { profiles: newProfiles };
          }
          return { profiles: [...s.profiles, profile] };
        });
        return id;
      },

      updateProfile: (id, patch) => {
        set(s => {
          // ⚡ Bolt Optimization: Replace O(N) array mapping with single target clone
          // Avoids reallocating every item in the array if we only need to change one.
          const targetIndex = s.profiles.findIndex(p => p.id === id);
          if (targetIndex === -1) return s;

          const newProfiles = [...s.profiles];
          newProfiles[targetIndex] = { ...newProfiles[targetIndex], ...patch };
          return { profiles: newProfiles };
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
          // ⚡ Bolt: Prevent array allocation and GC overhead
          // Only map if something actually changed. Find existing default first.
          const hasChange = s.profiles.some(p => (p.isDefault && p.id !== id) || (!p.isDefault && p.id === id));
          if (!hasChange) return s;

          const newProfiles = [...s.profiles];
          for (let i = 0; i < newProfiles.length; i++) {
            if (newProfiles[i].isDefault && newProfiles[i].id !== id) {
              newProfiles[i] = { ...newProfiles[i], isDefault: false };
            } else if (!newProfiles[i].isDefault && newProfiles[i].id === id) {
              newProfiles[i] = { ...newProfiles[i], isDefault: true };
            }
          }
          return { profiles: newProfiles };
        });
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      connectProfile: async (id) => {
        const profile = get().profiles.find(p => p.id === id);
        if (!profile || !profile.url || profile.url.trim() === '') return 'offline';

        set({ connectionStatus: 'checking' });
        const result = await checkHealth(profile.url, profile.apiKey);

        set(s => {
          // ⚡ Bolt Optimization: Replace O(N) array mapping with single target clone
          const targetIndex = s.profiles.findIndex(p => p.id === id);
          if (targetIndex === -1) {
            return {
              connectionStatus: result.status,
              activeProfileId: result.status === 'online' ? id : s.activeProfileId,
            };
          }

          const newProfiles = [...s.profiles];
          newProfiles[targetIndex] = { ...newProfiles[targetIndex], lastHealthStatus: result.status, lastCheckedAt: Date.now() };

          return {
            connectionStatus: result.status,
            activeProfileId: result.status === 'online' ? id : s.activeProfileId,
            profiles: newProfiles
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
