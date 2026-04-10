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
      const nodeIdsSet = new Set<string>();
      const prevIds = new Set<string>();

      // ⚡ Bolt: Replace chained .map().filter() traversals with single-pass accumulations
      // to reduce intermediate array allocations and GC overhead
      for (let i = 0; i < s.nodes.length; i++) prevIds.add(s.nodes[i].nodeId);
      for (let i = 0; i < nodes.length; i++) nodeIdsSet.add(nodes[i].nodeId);

      const newSelectedIds: string[] = [];
      const newPipelineIds: string[] = [];
      const isFirstSync = s.nodes.length === 0;

      if (!isFirstSync) {
        for (let i = 0; i < s.selectedNodeIds.length; i++) {
          if (nodeIdsSet.has(s.selectedNodeIds[i])) newSelectedIds.push(s.selectedNodeIds[i]);
        }
      }

      const pipelineOrderSet = new Set(s.pipelineOrder);
      for (let i = 0; i < s.pipelineOrder.length; i++) {
        if (nodeIdsSet.has(s.pipelineOrder[i])) newPipelineIds.push(s.pipelineOrder[i]);
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (isFirstSync) {
          if (n.online) newSelectedIds.push(n.nodeId);
        } else if (n.online && !prevIds.has(n.nodeId)) {
          newSelectedIds.push(n.nodeId);
        }

        if (!pipelineOrderSet.has(n.nodeId)) {
          newPipelineIds.push(n.nodeId);
        }
      }

      return { nodes, selectedNodeIds: newSelectedIds, pipelineOrder: newPipelineIds };
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
    set({
      selectedNodeIds: nodes.reduce<string[]>((acc, n) => {
        if (n.online) acc.push(n.nodeId);
        return acc;
      }, [])
    });
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
