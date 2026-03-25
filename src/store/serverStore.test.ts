import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useServerStore } from './serverStore';

vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config
}));

describe('ServerStore - removeProfile', () => {
  beforeEach(() => {
    // Re-initialize the entire store state, preserving functions
    const initialState = useServerStore.getInitialState ? useServerStore.getInitialState() : useServerStore.getState();
    useServerStore.setState({ ...initialState, profiles: [], activeProfileId: null }, true);
  });

  it('removes the active profile and falls back to the default profile', () => {
    const store = useServerStore.getState();
    const id1 = store.addProfile({ name: 'Profile 1', tier: 'local', agentId: 'claude', url: 'http://localhost' });
    store.setDefault(id1);

    const id2 = store.addProfile({ name: 'Profile 2', tier: 'local', agentId: 'claude', url: 'http://localhost' });

    useServerStore.getState().setActiveProfile(id2);
    expect(useServerStore.getState().activeProfileId).toBe(id2);

    useServerStore.getState().removeProfile(id2);

    const state = useServerStore.getState();
    expect(state.profiles).toHaveLength(1);
    expect(state.profiles[0].id).toBe(id1);
    expect(state.activeProfileId).toBe(id1);
  });

  it('removes the default profile and ensures another profile becomes the new default', () => {
    const store = useServerStore.getState();
    const id1 = store.addProfile({ name: 'Profile 1', tier: 'local', agentId: 'claude', url: 'http://localhost' });
    store.setDefault(id1);
    const id2 = store.addProfile({ name: 'Profile 2', tier: 'local', agentId: 'claude', url: 'http://localhost' });
    const id3 = store.addProfile({ name: 'Profile 3', tier: 'local', agentId: 'claude', url: 'http://localhost' });

    useServerStore.getState().removeProfile(id1);

    const state = useServerStore.getState();
    expect(state.profiles).toHaveLength(2);
    // id2 was the first remaining profile, so it should become the new default
    const newDefault = state.profiles.find(p => p.id === id2);
    expect(newDefault).toBeDefined();
    expect(newDefault?.isDefault).toBe(true);
    // id3 should not be default
    const otherProfile = state.profiles.find(p => p.id === id3);
    expect(otherProfile?.isDefault).toBe(false);
  });

  it('removes a profile that is both active and default, transitioning both states', () => {
    const store = useServerStore.getState();
    const id1 = store.addProfile({ name: 'Profile 1', tier: 'local', agentId: 'claude', url: 'http://localhost' });
    store.setDefault(id1);
    const id2 = store.addProfile({ name: 'Profile 2', tier: 'local', agentId: 'claude', url: 'http://localhost' });

    useServerStore.getState().setActiveProfile(id1);

    useServerStore.getState().removeProfile(id1);

    const state = useServerStore.getState();
    expect(state.profiles).toHaveLength(1);
    expect(state.profiles[0].id).toBe(id2);
    expect(state.profiles[0].isDefault).toBe(true);
    expect(state.activeProfileId).toBe(id2);
  });

  it('removes the only existing profile, transitioning to empty state', () => {
    const store = useServerStore.getState();
    const id1 = store.addProfile({ name: 'Profile 1', tier: 'local', agentId: 'claude', url: 'http://localhost' });
    store.setDefault(id1);

    useServerStore.getState().setActiveProfile(id1);

    useServerStore.getState().removeProfile(id1);

    const state = useServerStore.getState();
    expect(state.profiles).toHaveLength(0);
    expect(state.activeProfileId).toBe(null);
  });
});
