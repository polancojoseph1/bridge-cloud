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
   * ⚡ Bolt Optimization: Memoized array return
   * 💡 What: Wrapped the returned mapped array in `useMemo` tied to `status`.
   * 🎯 Why: Previously, this custom hook returned a new array reference on *every* render cycle of the parent component.
   *         This constantly invalidated downstream `useMemo` blocks (like the O(N) array partition in ProviderSelector.tsx),
   *         causing them to needlessly re-execute and allocate memory.
   * 📊 Impact: Preserves downstream memoizations. Reduces O(N) derivations from "every render" to "only when status changes".
   */
  return useMemo(() => AGENTS.map(agent => ({
    ...agent,
    isOnline: status === 'online',
    healthStatus: status,
    lastCheckedAt: null,
    profileId: null,
  })), [status]);
}
