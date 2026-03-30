'use client';
import { useState } from 'react';
import type { OrchestrationJob, SubtaskResult } from '@/types';
import { cn } from '@/lib/cn';
import { ChevronDown, CheckCircle, XCircle, Clock, Loader, Zap } from 'lucide-react';

function StatusIcon({ status }: { status: SubtaskResult['status'] }) {
  switch (status) {
    case 'done':      return <CheckCircle className="w-3.5 h-3.5 text-[#34d399]" />;
    case 'failed':
    case 'timeout':   return <XCircle className="w-3.5 h-3.5 text-[#fb7185]" />;
    case 'streaming': return <Loader className="w-3.5 h-3.5 text-[#6c8cff] animate-spin" />;
    case 'sent':      return <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />;
    default:          return <Clock className="w-3.5 h-3.5 text-[#3c3c3c]" />;
  }
}

function SubtaskCard({
  task,
  defaultOpen,
}: {
  task: SubtaskResult;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="border border-[#1e3025] rounded-lg overflow-hidden"
      style={{ borderLeftColor: task.nodeColor, borderLeftWidth: '2px' }}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={`${open ? 'Collapse' : 'Expand'} result for ${task.nodeName}`}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#0d1a11] hover:bg-[#111f15] transition-colors"
      >
        <StatusIcon status={task.status} />

        <span
          className="text-[12px] font-medium"
          style={{ color: task.nodeColor }}
        >
          {task.nodeName}
        </span>

        {task.elapsedMs !== undefined && task.status === 'done' && (
          <span className="text-[10px] text-[#3c5c48] ml-auto mr-1">
            {(task.elapsedMs / 1000).toFixed(1)}s
          </span>
        )}
        {task.status === 'streaming' && (
          <span className="text-[10px] text-[#6c8cff] ml-auto mr-1 animate-pulse">
            streaming…
          </span>
        )}
        {task.status === 'sent' && (
          <span className="text-[10px] text-[#f59e0b] ml-auto mr-1">
            waiting…
          </span>
        )}

        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-[#3c5c48] flex-shrink-0 transition-transform duration-150',
            !open && '-rotate-90',
            task.elapsedMs !== undefined || task.status === 'streaming' || task.status === 'sent'
              ? ''
              : 'ml-auto'
          )}
        />
      </button>

      {/* Result body */}
      {open && task.result && (
        <div className="px-3 py-2.5 bg-[#0a1410] border-t border-[#1e3025]">
          <p className={cn(
            'text-[13px] leading-[1.7] text-[#ececec] whitespace-pre-wrap break-words',
            task.status === 'streaming' && 'stream-cursor'
          )}>
            {task.result}
          </p>
        </div>
      )}
    </div>
  );
}

interface OrchestrationPanelProps {
  job: OrchestrationJob;
}

export default function OrchestrationPanel({ job }: OrchestrationPanelProps) {
  // Optimize array length counting: replace intermediate .filter() arrays with .reduce()
  // to prevent O(N) memory allocations and reduce React GC pauses
  const doneCount  = job.subtasks.reduce((count, t) => count + (t.status === 'done' ? 1 : 0), 0);
  const totalCount = job.subtasks.length;
  const isRunning  = job.status === 'running' || job.status === 'reducing';

  const modeLabel: Record<string, string> = {
    broadcast: 'Broadcast',
    parallel:  'Parallel split',
    pipeline:  'Pipeline',
    gather:    'Gather + reduce',
    single:    'Single',
  };

  return (
    <div className="w-full space-y-2">
      {/* Job header bar */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3.5 h-3.5 text-[#6c8cff]" />
        <span className="text-[11px] font-semibold text-[#6c8cff] uppercase tracking-wide">
          {modeLabel[job.mode]}
        </span>
        <span className="text-[11px] text-[#3c5c48]">
          {isRunning ? `${doneCount}/${totalCount} machines done` : `${totalCount} machines`}
        </span>
        {isRunning && (
          <Loader className="w-3 h-3 text-[#6c8cff] animate-spin ml-1" />
        )}
        {job.status === 'done' && (
          <CheckCircle className="w-3 h-3 text-[#34d399] ml-1" />
        )}
      </div>

      {/* Per-node subtask cards */}
      <div className="space-y-2">
        {job.subtasks.map((task, idx) => (
          <SubtaskCard key={task.subtaskId} task={task} defaultOpen={idx === 0} />
        ))}
      </div>

      {/* Final synthesized result (gather/pipeline mode) */}
      {job.finalResult && (
        <div className="mt-4 border border-[#2d4055] border-l-[#6c8cff] rounded-lg overflow-hidden"
          style={{ borderLeftWidth: '3px' }}>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1220]">
            <Zap className="w-3.5 h-3.5 text-[#6c8cff]" />
            <span className="text-[11px] font-semibold text-[#6c8cff]">Final answer</span>
          </div>
          <div className="px-3 py-3 bg-[#0a1018]">
            <p className="text-[15px] leading-[1.75] text-[#ececec] whitespace-pre-wrap break-words">
              {job.finalResult}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
