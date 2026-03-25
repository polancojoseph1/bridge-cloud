'use client';
import { useEffect, useMemo } from 'react';
import { useOrchestrationStore, type BridgeNode } from '@/store/orchestrationStore';
import { useServerStore } from '@/store/serverStore';
import type { ServerProfile } from '@/types';
import { cn } from '@/lib/cn';
import { Check, ArrowRight, WifiOff, Plus } from 'lucide-react';

// Color palette for servers (cycles if > 6 servers)
const SERVER_COLORS = ['#6c8cff', '#34d399', '#f59e0b', '#fb7185', '#a78bfa', '#38bdf8'];

// Convert server profiles → BridgeNode[]
function profilesToNodes(profiles: ServerProfile[]): BridgeNode[] {
  return profiles.map((p, i) => ({
    nodeId: p.id,
    nodeName: p.name,
    capabilities: ['chat'],
    online: p.lastHealthStatus === 'online',
    color: SERVER_COLORS[i % SERVER_COLORS.length],
  }));
}

function NodeChip({
  node,
  selected,
  onClick,
  showArrow,
}: {
  node: BridgeNode;
  selected: boolean;
  onClick: () => void;
  showArrow?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={!node.online}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6c8cff]',
          !node.online && 'opacity-40 cursor-not-allowed',
          node.online && selected
            ? 'border-opacity-60 bg-[#111f15]'
            : node.online
            ? 'border-[#1e3025] bg-[#0d1a11] text-[#5c5c5c] hover:text-[#9b9b9b] hover:border-[#2d4035]'
            : 'border-[#1e3025] bg-[#0d1a11] text-[#3c3c3c]'
        )}
        style={
          selected && node.online
            ? { borderColor: node.color + '60', color: node.color }
            : undefined
        }
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: node.online ? node.color : '#3c3c3c' }}
        />
        <span>{node.nodeName}</span>
        {selected && node.online && (
          <Check className="w-3 h-3 flex-shrink-0" style={{ color: node.color }} />
        )}
        {!node.online && (
          <WifiOff className="w-3 h-3 flex-shrink-0 text-[#3c3c3c]" />
        )}
      </button>

      {showArrow && (
        <ArrowRight className="w-3.5 h-3.5 text-[#2d4035] flex-shrink-0" />
      )}
    </div>
  );
}

export default function NodeTray() {
  const mode = useOrchestrationStore(s => s.mode);
  const nodes = useOrchestrationStore(s => s.nodes);
  const selectedNodeIds = useOrchestrationStore(s => s.selectedNodeIds);
  const pipelineOrder = useOrchestrationStore(s => s.pipelineOrder);
  const toggleNode = useOrchestrationStore(s => s.toggleNode);
  const selectAllNodes = useOrchestrationStore(s => s.selectAllNodes);
  const clearNodeSelection = useOrchestrationStore(s => s.clearNodeSelection);
  const syncNodes = useOrchestrationStore(s => s.syncNodes);
  const nodeTrayOpen = useOrchestrationStore(s => s.nodeTrayOpen);

  const profiles = useServerStore(s => s.profiles);
  const openManage = useServerStore(s => s.openManage);

  // Keep orchestration nodes in sync with server profiles
  useEffect(() => {
    syncNodes(profilesToNodes(profiles));
  }, [profiles, syncNodes]);

  if (!nodeTrayOpen || mode === 'single') return null;

  const modeLabel: Record<string, string> = {
    broadcast: 'Broadcast to:',
    parallel:  'Split across:',
    pipeline:  'Pipeline order:',
    gather:    'Gather from:',
  };

  // Optimize array length counting: replace intermediate .filter() arrays with .reduce()
  // to prevent O(N) memory allocations and reduce React GC pauses
  const onlineCount = nodes.reduce((count, n) => count + (n.online ? 1 : 0), 0);
  const selectedCount = selectedNodeIds.reduce((count, id) =>
    count + (nodes.find(n => n.nodeId === id)?.online ? 1 : 0), 0
  );

  const orderedNodes =
    mode === 'pipeline'
      ? pipelineOrder
          .map(id => nodes.find(n => n.nodeId === id))
          .filter(Boolean) as BridgeNode[]
      : nodes;

  const selectedNodeSet = useMemo(() => new Set(selectedNodeIds), [selectedNodeIds]);

  return (
    <div className="w-full max-w-[720px] mx-auto mb-2 animate-fade-in">
      <div className="bg-[#0d1a11] border border-[#1e3025] rounded-xl px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-medium text-[#5c5c5c] uppercase tracking-wide">
            {modeLabel[mode] ?? 'Servers:'}
          </span>
          <div className="flex items-center gap-3">
            {nodes.length > 0 && (
              <span className="text-[11px] text-[#3c5c48]">
                {selectedCount}/{onlineCount} online
              </span>
            )}
            {mode !== 'pipeline' && nodes.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => selectAllNodes(nodes)}
                  className="text-[11px] text-[#5c5c5c] hover:text-[#9b9b9b] transition-colors"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={clearNodeSelection}
                  className="text-[11px] text-[#5c5c5c] hover:text-[#9b9b9b] transition-colors"
                >
                  None
                </button>
              </>
            )}
          </div>
        </div>

        {/* Server chips */}
        <div className="flex flex-wrap gap-2">
          {orderedNodes.map((node, idx) => (
            <NodeChip
              key={node.nodeId}
              node={node}
              selected={selectedNodeSet.has(node.nodeId)}
              onClick={() => toggleNode(node.nodeId)}
              showArrow={mode === 'pipeline' && idx < orderedNodes.length - 1}
            />
          ))}

          {/* Add server CTA */}
          <button
            type="button"
            onClick={() => openManage('add')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#2d4035] text-[12px] text-[#3c5c48] hover:text-[#6c8cff] hover:border-[#6c8cff] transition-colors duration-150"
          >
            <Plus className="w-3 h-3" />
            Add server
          </button>
        </div>

        {/* Empty state */}
        {nodes.length === 0 && (
          <p className="text-[11px] text-[#3c3c3c] mt-1">
            Connect a server above to get started.
          </p>
        )}

        {/* Mode hints */}
        {mode === 'pipeline' && nodes.length > 0 && (
          <p className="text-[10px] text-[#3c5c48] mt-2">
            Each server receives the previous server&apos;s output as context.
          </p>
        )}
        {mode === 'gather' && nodes.length > 0 && (
          <p className="text-[10px] text-[#3c5c48] mt-2">
            Selected servers work in parallel. The last selected server synthesizes the final answer.
          </p>
        )}
      </div>
    </div>
  );
}
