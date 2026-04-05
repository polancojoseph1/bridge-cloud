'use client';
import { useState, useEffect, useMemo } from 'react';
import { AGENTS } from '@/lib/agents';
import { checkHealth } from '@/lib/healthCheck';
import type { AgentWithHealth, HealthStatus } from '@/types';

type StatusBroadcast = HealthStatus;

let cachedStatus: StatusBroadcast = 'checking';
const listeners = new Set<(s: StatusBroadcast) => void>();

let serverStoreModule: typeof import('@/store/serverStore') | null = null;

async function pollActive() {
  try {
    if (!serverStoreModule) {
      serverStoreModule = await import('@/store/serverStore');
    }
    const { useServerStore } = serverStoreModule;
    const profile = useServerStore.getState().activeProfile();
    if (!profile?.url || profile.url.trim() === '') {
      cachedStatus = 'offline';
      listeners.forEach(fn => fn('offline'));
      return;
    }
    const result = await checkHealth(profile.url, profile.apiKey ?? '');
    cachedStatus = result.status;
    listeners.forEach(fn => fn(result.status));
  } catch {
    // leave existing state
  }
}

let pollTimer: ReturnType<typeof setInterval> | null = null;
function startSharedPoll() {
  if (pollTimer !== null) return;
  pollActive();
  pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible') pollActive();
  }, 30_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pollActive();
  });
}

export function useAgentHealth(): AgentWithHealth[] {
  const [status, setStatus] = useState<StatusBroadcast>(cachedStatus);

  useEffect(() => {
    setStatus(cachedStatus);
    listeners.add(setStatus);
    startSharedPoll();
    return () => { listeners.delete(setStatus); };
  }, []);

  /**
   * ⚡ Bolt Optimization: Wrap hook return mapped array in useMemo()
   * 💡 What: Prevents useAgentHealth from returning a fresh array on every single render cycle.
   * 🎯 Why: When not memoized, this hook returned a new array reference every render. Components
   *         that call this hook (like ProviderSelector) wrap downstream logic in useMemo based
   *         on this returned array. Since the array reference constantly changed, downstream useMemo
   *         blocks were completely defeated, causing unnecessary O(N) array reductions on every render loop.
   * 📊 Impact: O(1) referential stability between health polling updates, restoring O(N) performance gains in UI hooks.
   */
  return useMemo(() => AGENTS.map(agent => ({
    ...agent,
    isOnline: status === 'online',
    healthStatus: status,
    lastCheckedAt: null,
    profileId: null,
  })), [status]);
}
