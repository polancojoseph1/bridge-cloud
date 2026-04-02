'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useInstanceStore } from '@/store/instanceStore';
import type { Instance } from '@/types';
import { AGENT_DOT_COLORS } from '@/lib/agents';
import { NewInstanceButton } from './NewInstancePicker';

// ─── Individual tab (web) ──────────────────────────────────────────────────

function InstanceTab({ instanceId }: { instanceId: string }) {
  const activeInstanceId = useInstanceStore(s => s.activeInstanceId);
  const setActive       = useInstanceStore(s => s.setActiveInstance);
  const close           = useInstanceStore(s => s.closeInstance);

  const instance = useInstanceStore(useCallback(s => s.instances.find(i => i.instanceId === instanceId), [instanceId]));
  const instancesLength = useInstanceStore(s => s.instances.length);

  if (!instance) return null;

  const isActive  = activeInstanceId === instanceId;
  const dotColor  = AGENT_DOT_COLORS[instance.agentId] ?? '#5c5c5c';
  const canClose  = instancesLength > 1 && !instance.isPinned;

  return (
    <button
      type="button"
      data-instance-id={instanceId}
      onClick={() => setActive(instanceId)}
      className={cn(
        'group flex items-center gap-1.5 px-3 h-full flex-shrink-0 relative',
        'text-[12px] font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#6c8cff]',
        isActive
          ? 'text-[#ececec] bg-[#111f15]'
          : 'text-[#5c5c5c] hover:text-[#9b9b9b] hover:bg-[#0d1a11]'
      )}
    >
      {/* Active underline accent */}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full" style={{ backgroundColor: dotColor }} />
      )}

      {/* Agent color dot */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: isActive ? dotColor : '#3c3c3c' }}
      />

      {/* Label */}
      <span className="max-w-[96px] truncate">{instance.label}</span>

      {/* Close */}
      {canClose && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Close ${instance.label}`}
          onClick={e => { e.stopPropagation(); close(instanceId); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); close(instanceId); } }}
          className={cn(
            'w-3.5 h-3.5 flex items-center justify-center rounded-sm flex-shrink-0',
            'opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:bg-[#2d4035]',
            'transition-all duration-100',
            isActive && 'opacity-50 group-hover:opacity-70'
          )}
        >
          <X className="w-2.5 h-2.5" />
        </span>
      )}
    </button>
  );
}

// ─── Mobile pill ───────────────────────────────────────────────────────────

function MobileInstancePill({ instanceId }: { instanceId: string }) {
  const activeInstanceId = useInstanceStore(s => s.activeInstanceId);
  const setActive        = useInstanceStore(s => s.setActiveInstance);
  const close            = useInstanceStore(s => s.closeInstance);

  const instance = useInstanceStore(useCallback(s => s.instances.find(i => i.instanceId === instanceId), [instanceId]));
  const instancesLength = useInstanceStore(s => s.instances.length);

  if (!instance) return null;

  const isActive = activeInstanceId === instanceId;
  const dotColor = AGENT_DOT_COLORS[instance.agentId] ?? '#5c5c5c';
  const canClose = instancesLength > 1;

  return (
    <div
      data-instance-id={instanceId}
      className={cn(
        'flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full flex-shrink-0',
        'text-[12px] font-medium transition-colors duration-150',
        isActive
          ? 'bg-[#1e3025] text-[#ececec]'
          : 'bg-[#0d1a11] text-[#5c5c5c] border border-[#1e3025]'
      )}
    >
      <button type="button" onClick={() => setActive(instanceId)} className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? dotColor : '#3c3c3c' }} />
        <span>{instance.label}</span>
      </button>
      {canClose && (
        <button
          type="button"
          onClick={() => close(instanceId)}
          aria-label={`Close ${instance.label}`}
          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#2d4035] transition-colors"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function InstanceTabBar() {
  const instances        = useInstanceStore(s => s.instances);
  const activeInstanceId = useInstanceStore(s => s.activeInstanceId);
  const scrollRef        = useRef<HTMLDivElement>(null);
  const mobileScrollRef  = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!activeInstanceId) return;
    const selector = `[data-instance-id="${activeInstanceId}"]`;
    scrollRef.current?.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    mobileScrollRef.current?.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }, [activeInstanceId]);

  function updateScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function nudge(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  }

  return (
    <>
      {/* ── Desktop tab bar ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center h-9 flex-shrink-0 border-t border-[#1e3025] bg-[#0a1410] relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => nudge('left')}
            aria-label="Scroll left"
            className="flex-shrink-0 w-6 h-full flex items-center justify-center bg-gradient-to-r from-[#0a1410] via-[#0a1410] to-transparent text-[#5c5c5c] hover:text-[#ececec] z-10"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="flex-1 flex items-stretch h-full overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {instances.map(i => <InstanceTab key={`desktop-${i.instanceId}`} instanceId={i.instanceId} />)}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => nudge('right')}
            aria-label="Scroll right"
            className="flex-shrink-0 w-6 h-full flex items-center justify-center bg-gradient-to-l from-[#0a1410] via-[#0a1410] to-transparent text-[#5c5c5c] hover:text-[#ececec] z-10"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex-shrink-0 flex items-center px-2 h-full border-l border-[#1e3025]">
          <NewInstanceButton />
        </div>
      </div>

      {/* ── Mobile bottom tab bar ───────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center h-14 bg-[#0e1c14] border-t border-[#1e3025] safe-area-pb">
        <div
          ref={mobileScrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto px-3 h-full"
          style={{ scrollbarWidth: 'none' }}
        >
          {instances.map(i => <MobileInstancePill key={`mobile-${i.instanceId}`} instanceId={i.instanceId} />)}
        </div>
        <div className="flex-shrink-0 pr-3 pl-2 border-l border-[#1e3025] h-full flex items-center">
          <NewInstanceButton />
        </div>
      </div>
    </>
  );
}
