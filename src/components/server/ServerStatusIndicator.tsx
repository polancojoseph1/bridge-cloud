'use client';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { cn } from '@/lib/cn';
import ServerSwitcherPopover from './ServerSwitcherPopover';

export default function ServerStatusIndicator() {
  const [showPopover, setShowPopover] = useState(false);
  const activeProfile = useServerStore(s => s.activeProfile)();
  const connectionStatus = useServerStore(s => s.connectionStatus);

  const dotColor = {
    online: '#10a37f',
    offline: '#ef4444',
    checking: '#f59e0b',
    auth_error: '#ef4444',
    unknown: '#565656',
  }[connectionStatus] ?? '#565656';

  const statusLabel = {
    online: 'Online',
    offline: 'Offline',
    checking: 'Checking…',
    auth_error: 'Auth error',
    unknown: 'Not connected',
  }[connectionStatus] ?? 'Unknown';

  if (!activeProfile) return null;

  return (
    <div className="relative px-2 pb-2">
      {showPopover && (
        <ServerSwitcherPopover onClose={() => setShowPopover(false)} />
      )}
      <button
        onClick={() => setShowPopover(v => !v)}
        aria-haspopup="dialog"
        aria-expanded={showPopover}
        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#152219] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
      >
        {/* Status dot */}
        <span
          className={cn('w-2 h-2 rounded-full flex-shrink-0', connectionStatus === 'checking' && 'animate-pulse')}
          style={{ backgroundColor: dotColor }}
        />
        {/* Name + status */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[13px] text-[#ececec] truncate leading-tight">{activeProfile.name}</div>
          <div className="text-[11px] text-[#8e8e8e] leading-tight">{statusLabel}</div>
        </div>
        {showPopover ? (
          <ChevronDown size={12} className="text-[#565656] flex-shrink-0" />
        ) : (
          <ChevronUp size={12} className="text-[#565656] flex-shrink-0" />
        )}
      </button>
    </div>
  );
}
