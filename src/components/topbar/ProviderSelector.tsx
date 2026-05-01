'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, WifiOff, Settings } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAgentHealth } from '@/hooks/useAgentHealth';
import { useOrchestrationStore } from '@/store/orchestrationStore';
import { useServerStore } from '@/store/serverStore';
import type { AgentWithHealth } from '@/types';

interface ProviderSelectorProps {
  activeAgentId: string;
  onSelect: (agentId: string) => void;
}

function HealthDot({ agent, animate }: { agent: AgentWithHealth; animate?: boolean }) {
  const color =
    agent.healthStatus === 'online'   ? agent.dotColor :
    agent.healthStatus === 'checking' ? '#f59e0b' : '#3c3c3c';
  return (
    <span
      className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        agent.healthStatus === 'online'   && animate && 'animate-dot-pulse',
        agent.healthStatus === 'checking' && 'animate-pulse',
      )}
      style={{ backgroundColor: color }}
    />
  );
}

function AgentRow({
  agent, isActive, onSelect, disabled,
}: {
  agent: AgentWithHealth; isActive: boolean; onSelect: () => void; disabled?: boolean;
}) {
  return (
    <div
      role="option"
      aria-selected={isActive}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      title={disabled ? `${agent.name} is offline` : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md',
        'text-[13px] transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6c8cff]',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : isActive
          ? 'bg-[#1e2a4a] text-[#ececec] cursor-pointer focus-visible:bg-[#1e2a4a]'
          : 'text-[#ececec] hover:bg-[#222222] cursor-pointer focus-visible:bg-[#222222]'
      )}
    >
      <HealthDot agent={agent} />
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-none mb-0.5">{agent.name}</div>
        <div className="text-[11px] text-[#5c5c5c] truncate">{agent.description}</div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {agent.isOnline && (
          <span className="text-[10px]" style={{ color: agent.dotColor }}>Online</span>
        )}
        {!agent.isOnline && !disabled && (
          <span className="text-[10px] text-[#5c5c5c]">Offline</span>
        )}
        {isActive && !disabled && <Check className="w-3.5 h-3.5 text-[#6c8cff]" />}
        {disabled && <WifiOff className="w-3.5 h-3.5 text-[#3c3c3c]" />}
      </div>
    </div>
  );
}

export default function ProviderSelector({ activeAgentId, onSelect }: ProviderSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const agents = useAgentHealth();
  const orchMode = useOrchestrationStore(s => s.mode);
  const openManage = useServerStore(s => s.openManage);
  const isOrchestrating = orchMode !== 'single';

  const activeAgent = useMemo(() => {
    return agents.find(a => a.id === activeAgentId) ?? agents[0];
  }, [agents, activeAgentId]);

  // Optimize array filtering: replace O(2N) double .filter() with O(N) single-pass .reduce()
  // to reduce memory allocations and React GC pauses during frequent health poll updates.
  const [onlineAgents, offlineAgents] = useMemo(() => {
    return agents.reduce<[AgentWithHealth[], AgentWithHealth[]]>(
      (acc, a) => {
        acc[a.isOnline ? 0 : 1].push(a);
        return acc;
      },
      [[], []]
    );
  }, [agents]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !isOrchestrating && setOpen(v => !v)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? "provider-listbox" : undefined}
        title={isOrchestrating ? 'Agent selection disabled in orchestration mode' : undefined}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'text-[13px] font-medium text-[#ececec]',
          'border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
          isOrchestrating
            ? 'border-transparent opacity-60 cursor-default'
            : open
            ? 'bg-[#111f15] border-[#1e3025]'
            : 'border-transparent hover:bg-[#111f15] hover:border-[#1e3025]'
        )}
      >
        {activeAgent && <HealthDot agent={activeAgent} animate />}
        <span>{activeAgent?.name ?? 'Claude'}</span>
        {!isOrchestrating && (
          <ChevronDown className={cn('w-3.5 h-3.5 text-[#5c5c5c] transition-transform duration-150', open && 'rotate-180')} />
        )}
      </button>

      {open && (
        <div
          id="provider-listbox"
          role="listbox"
          aria-label="Select AI provider"
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          className="absolute top-full right-0 mt-1 z-50 w-[260px] bg-[#181818] border border-[#1e3025] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1"
        >
          {onlineAgents.length > 0 && (
            <>
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] text-[#3c5c48] uppercase tracking-widest font-semibold">Available</span>
              </div>
              {onlineAgents.map(agent => (
                <AgentRow key={agent.id} agent={agent} isActive={agent.id === activeAgentId}
                  onSelect={() => { onSelect(agent.id); setOpen(false); }} />
              ))}
            </>
          )}

          {onlineAgents.length > 0 && offlineAgents.length > 0 && (
            <div className="my-1 border-t border-[#1e3025]" />
          )}

          {offlineAgents.length > 0 && (
            <>
              <div className="px-3 pt-1 pb-1">
                <span className="text-[10px] text-[#3c3c3c] uppercase tracking-widest font-semibold">Offline</span>
              </div>
              {offlineAgents.map(agent => (
                <AgentRow key={agent.id} agent={agent} isActive={agent.id === activeAgentId}
                  onSelect={() => {}} disabled />
              ))}
            </>
          )}

          <div className="border-t border-[#1e3025] mt-1 pt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); openManage('list'); }}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#1a1a1a] transition-colors rounded-md mx-1 w-[calc(100%-8px)] focus-visible:bg-[#1a1a1a] focus-visible:text-[#9b9b9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage servers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
