'use client';
import { useOrchestrationStore } from '@/store/orchestrationStore';
import type { OrchestrationMode } from '@/types';
import { cn } from '@/lib/cn';

const MODES: { id: OrchestrationMode; label: string; title: string }[] = [
  { id: 'single',    label: 'Single',    title: 'Send to one agent' },
  { id: 'broadcast', label: 'Broadcast', title: 'Send to all machines simultaneously' },
  { id: 'parallel',  label: 'Parallel',  title: 'Split task across machines at once' },
  { id: 'pipeline',  label: 'Pipeline',  title: 'Chain machines in sequence' },
  { id: 'gather',    label: 'Gather',    title: 'Fan-out then reduce to one answer' },
];

export default function ModePill() {
  // Currently disabled gracefully as it's not wired to the proxy
  return null;

  /*
  const mode = useOrchestrationStore(s => s.mode);
  const setMode = useOrchestrationStore(s => s.setMode);

  return (
    <div
      className="flex items-center gap-0.5 bg-[#0d1a11] border border-[#1e3025] rounded-lg p-0.5"
      role="radiogroup"
      aria-label="Orchestration mode"
    >
      {MODES.map(m => {
        const isActive = mode === m.id;
        const isDisabled = m.id !== 'single';
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            title={isDisabled ? "Coming soon" : m.title}
            onClick={isDisabled ? undefined : () => setMode(m.id)}
            disabled={isDisabled}
            className={cn(
              'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6c8cff]',
              isActive
                ? 'bg-[#1e3025] text-[#ececec] shadow-sm'
                : 'text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#111f15]',
              isDisabled && 'opacity-50 cursor-not-allowed hover:text-[#5c5c5c] hover:bg-transparent'
            )}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
  */
}
