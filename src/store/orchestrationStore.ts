'use client';
import { create } from 'zustand';
import type { OrchestrationMode, OrchestrationJob } from '@/types';

export interface BridgeNode {
  nodeId: string;
  nodeName: string;
  capabilities: string[];
  online: boolean;
  color: string;
}

interface OrchestrationStore {
  mode: OrchestrationMode;
  nodes: BridgeNode[];
  selectedNodeIds: string[];
  pipelineOrder: string[];
  activeJob: OrchestrationJob | null;
  nodeTrayOpen: boolean;

  setMode: (mode: OrchestrationMode) => void;
  syncNodes: (nodes: BridgeNode[]) => void;
  toggleNode: (nodeId: string) => void;
  selectAllNodes: (nodes: BridgeNode[]) => void;
  clearNodeSelection: () => void;
  movePipelineNode: (from: number, to: number) => void;
  setActiveJob: (job: OrchestrationJob | null) => void;
  setNodeTrayOpen: (open: boolean) => void;
  onlineNodes: () => BridgeNode[];
}

export const useOrchestrationStore = create<OrchestrationStore>((set, get) => ({
  mode: 'single',
  nodes: [],
  selectedNodeIds: [],
  pipelineOrder: [],
  activeJob: null,
  nodeTrayOpen: false,

  setMode: (mode) => {
    set({ mode, nodeTrayOpen: mode !== 'single' });
  },

  // Called when server profiles change — syncs nodes, preserves user selections
  syncNodes: (nodes) => {
    set(s => {
      const nodeIdsSet = new Set(nodes.map(n => n.nodeId));
      const prevIds = new Set(s.nodes.map(n => n.nodeId));
      const isFirstSync = s.nodes.length === 0;

      // ⚡ Bolt: Replace multiple O(N) chained array methods (.filter().map())
      // with a single O(N) pass to reduce intermediate array allocations and GC overhead
      const newSelectedNodeIds: string[] = [];
      const newPipelineOrder: string[] = [];

      const pipelineOrderSet = new Set(s.pipelineOrder);

      // Preserve existing valid selected nodes
      if (!isFirstSync) {
        for (const id of s.selectedNodeIds) {
          if (nodeIdsSet.has(id)) {
            newSelectedNodeIds.push(id);
          }
        }
      }

      // Preserve existing valid pipeline order
      for (const id of s.pipelineOrder) {
        if (nodeIdsSet.has(id)) {
          newPipelineOrder.push(id);
        }
      }

      // Process new nodes in a single pass
      for (const n of nodes) {
        if (isFirstSync) {
          if (n.online) newSelectedNodeIds.push(n.nodeId);
        } else {
          if (n.online && !prevIds.has(n.nodeId)) newSelectedNodeIds.push(n.nodeId);
        }
        if (!pipelineOrderSet.has(n.nodeId)) newPipelineOrder.push(n.nodeId);
      }

      return { nodes, selectedNodeIds: newSelectedNodeIds, pipelineOrder: newPipelineOrder };
    });
  },

  toggleNode: (nodeId) => {
    set(s => {
      const index = s.selectedNodeIds.indexOf(nodeId);
      if (index !== -1) {
        const copy = [...s.selectedNodeIds];
        copy.splice(index, 1);
        return { selectedNodeIds: copy };
      }
      return { selectedNodeIds: [...s.selectedNodeIds, nodeId] };
    });
  },

  selectAllNodes: (nodes) => {
    set({ selectedNodeIds: nodes.filter(n => n.online).map(n => n.nodeId) });
  },

  clearNodeSelection: () => set({ selectedNodeIds: [] }),

  movePipelineNode: (from, to) => {
    set(s => {
      const order = [...s.pipelineOrder];
      const [item] = order.splice(from, 1);
      order.splice(to, 0, item);
      return { pipelineOrder: order };
    });
  },

  setActiveJob: (job) => set({ activeJob: job }),
  setNodeTrayOpen: (open) => set({ nodeTrayOpen: open }),

  onlineNodes: () => get().nodes.filter(n => n.online),
}));
