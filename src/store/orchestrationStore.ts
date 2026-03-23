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

      const selectedNodeIds = isFirstSync
        ? nodes.filter(n => n.online).map(n => n.nodeId)
        : [
            ...s.selectedNodeIds.filter(id => nodeIdsSet.has(id)),
            ...nodes.filter(n => n.online && !prevIds.has(n.nodeId)).map(n => n.nodeId),
          ];

      const pipelineOrderSet = new Set(s.pipelineOrder);
      const pipelineOrder = [
        ...s.pipelineOrder.filter(id => nodeIdsSet.has(id)),
        ...nodes.filter(n => !pipelineOrderSet.has(n.nodeId)).map(n => n.nodeId),
      ];
      return { nodes, selectedNodeIds, pipelineOrder };
    });
  },

  toggleNode: (nodeId) => {
    set(s => {
      const has = s.selectedNodeIds.includes(nodeId);
      const selectedNodeIds = has
        ? s.selectedNodeIds.filter(id => id !== nodeId)
        : [...s.selectedNodeIds, nodeId];
      return { selectedNodeIds };
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
