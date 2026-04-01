'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, WifiOff } from 'lucide-react';
// NewInstancePicker (dropdown) kept for potential future use
import { cn } from '@/lib/cn';
import { useAgentHealth } from '@/hooks/useAgentHealth';
import { useInstanceStore } from '@/store/instanceStore';

interface NewInstancePickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

function NewInstancePicker({ open, onClose, anchorRef }: NewInstancePickerProps) {
  const agents = useAgentHealth();
  const createInstance = useInstanceStore(s => s.createInstance);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  // Optimize array filtering: replace O(2N) double .filter() with O(N) single-pass .reduce()
  // to reduce memory allocations and React GC pauses during frequent health poll updates.
  // ⚡ Bolt Optimization: Wrap with useMemo to prevent recalculating on every re-render
  // when agents array hasn't changed.
  const [onlineAgents, offlineAgents] = useMemo(() => agents.reduce<[typeof agents, typeof agents]>(
    (acc, a) => {
      acc[a.isOnline ? 0 : 1].push(a);
      return acc;
    },
    [[], []]
  ), [agents]);

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-1 z-50 w-[200px] bg-[#181818] border border-[#1e3025] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1"
    >
      <div className="px-3 pt-2 pb-1">
        <span className="text-[10px] text-[#3c5c48] uppercase tracking-widest font-semibold">New instance</span>
      </div>

      {onlineAgents.map(agent => (
        <button
          key={agent.id}
          type="button"
          onClick={() => { createInstance(agent.id); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-[#ececec] hover:bg-[#1e3025] transition-colors text-left"
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: agent.dotColor }} />
          {agent.name}
        </button>
      ))}

      {offlineAgents.length > 0 && (
        <>
          <div className="my-1 border-t border-[#1e3025]" />
          {offlineAgents.map(agent => (
            <div
              key={agent.id}
              title={`${agent.name} is offline`}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] opacity-35 cursor-not-allowed"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#3c3c3c]" />
              <span className="text-[#5c5c5c] flex-1">{agent.name}</span>
              <WifiOff className="w-3 h-3 text-[#3c3c3c]" />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function NewInstanceButton() {
  const instances = useInstanceStore(s => s.instances);
  const activeInstanceId = useInstanceStore(s => s.activeInstanceId);
  const createInstance = useInstanceStore(s => s.createInstance);
  const atMax = instances.length >= 8;

  const activeAgent = instances.find(i => i.instanceId === activeInstanceId)?.agentId ?? 'claude';

  return (
    <button
      type="button"
      onClick={() => { if (!atMax) createInstance(activeAgent); }}
      disabled={atMax}
      title={atMax ? 'Maximum 8 instances open' : 'New instance'}
      aria-label="New instance"
      className={cn(
        'w-6 h-6 flex items-center justify-center rounded-md',
        'border border-[#1e3025] transition-colors duration-150',
        atMax
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-[#1e3025] hover:border-[#2d4035] cursor-pointer text-[#5c5c5c] hover:text-[#9b9b9b]'
      )}
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  );
}

export default NewInstancePicker;
