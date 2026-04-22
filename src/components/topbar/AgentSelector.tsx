'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { AGENTS } from '@/lib/agents';
import { cn } from '@/lib/cn';
import { useClickOutside } from '@/hooks/useClickOutside';

interface AgentSelectorProps {
  activeAgentId: string;
  onSelect: (agentId: string) => void;
}

export default function AgentSelector({ activeAgentId, onSelect }: AgentSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeAgent = useMemo(() => {
    return AGENTS.find((a) => a.id === activeAgentId) ?? AGENTS[0];
  }, [activeAgentId]);

  const dotColor = activeAgent.dotColor;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(containerRef, handleClose, open);

  function handleSelect(agentId: string) {
    onSelect(agentId);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && open) {
            e.stopPropagation();
            setOpen(false);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? "agent-listbox" : undefined}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'text-[13px] font-medium text-[#ececec]',
          'border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
          open
            ? 'bg-[#111f15] border-[#1e3025]'
            : 'border-transparent hover:bg-[#111f15] hover:border-[#1e3025]'
        )}
      >
        {/* Agent color dot */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <span>{activeAgent.name}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-[#5c5c5c] transition-transform duration-150',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          id="agent-listbox"
          role="listbox"
          aria-label="Select agent"
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          className={cn(
            'absolute top-full left-0 mt-1 z-50',
            'w-[240px] bg-[#181818] border border-[#1e3025] rounded-lg',
            'shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1',
            'dropdown-panel'
          )}
        >
          {AGENTS.map((agent) => {
            const isActive = agent.id === activeAgentId;
            const agentDot = agent.dotColor;

            return (
              <div
                key={agent.id}
                role="option"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => handleSelect(agent.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(agent.id);
                  }
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 cursor-pointer mx-1 rounded-md',
                  'text-[13px] transition-colors duration-100',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6c8cff]',
                  isActive
                    ? 'bg-[#1e2a4a] text-[#ececec]'
                    : 'text-[#ececec] hover:bg-[#222222]'
                )}
              >
                {/* Agent color dot */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: agentDot }}
                />

                {/* Name + description */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium leading-none mb-0.5">{agent.name}</div>
                  <div className="text-[11px] text-[#5c5c5c] truncate">{agent.description}</div>
                </div>

                {/* Checkmark for active */}
                {isActive && (
                  <Check className="w-3.5 h-3.5 text-[#6c8cff] flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
