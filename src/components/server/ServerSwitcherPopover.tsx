'use client';
import { useEffect, useRef } from 'react';
import { Check, Plus } from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { cn } from '@/lib/cn';
import type { HealthStatus } from '@/types';

interface Props {
  onClose: () => void;
}

const dotColor = (s: HealthStatus) => ({
  online: '#10a37f',
  offline: '#ef4444',
  checking: '#f59e0b',
  auth_error: '#ef4444',
  unknown: '#565656',
}[s] ?? '#565656');

export default function ServerSwitcherPopover({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { profiles, activeProfileId, connectProfile } = useServerStore();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function keyHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-2 right-2 mb-1 rounded-xl bg-[#1a2e22] border border-[#2d4035] shadow-xl shadow-black/40 py-1 z-50 animate-badge-in"
    >
      <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-[#565656] font-medium">
        Connected servers
      </div>
      {profiles.map(profile => (
        <button
          key={profile.id}
          onClick={async () => { await connectProfile(profile.id); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#152219] transition-colors duration-100 text-left"
        >
          <span
            className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', profile.lastHealthStatus === 'checking' && 'animate-pulse')}
            style={{ backgroundColor: dotColor(profile.lastHealthStatus) }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-[#ececec] truncate">{profile.name}</div>
            <div className="text-[11px] text-[#565656]">
              {profile.tier === 'cloud' ? 'Bridge Cloud' : 'Local'}
            </div>
          </div>
          {profile.id === activeProfileId && (
            <Check size={13} className="text-[#10a37f] flex-shrink-0" />
          )}
        </button>
      ))}
      <div className="border-t border-[#2d4035] mt-1 pt-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#152219] transition-colors text-left text-[13px] text-[#8e8e8e] hover:text-[#ececec]">
          <Plus size={13} />
          Add server
        </button>
      </div>
    </div>
  );
}
