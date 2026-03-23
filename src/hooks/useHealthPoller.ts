'use client';
import { useEffect, useRef } from 'react';
import { useServerStore } from '@/store/serverStore';

export function useHealthPoller() {
  const profiles = useServerStore(s => s.profiles);
  const connectProfile = useServerStore(s => s.connectProfile);
  const didInitialPoll = useRef(false);

  useEffect(() => {
    if (profiles.length === 0) return;
    async function checkAll() {
      await Promise.all(profiles.map(p => connectProfile(p.id)));
    }
    if (!didInitialPoll.current) {
      didInitialPoll.current = true;
      checkAll();
    }
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') checkAll();
    }, 30_000);
    const onVisible = () => { if (document.visibilityState === 'visible') checkAll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
  }, [profiles.length]);
}
