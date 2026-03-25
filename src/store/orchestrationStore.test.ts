import { describe, it, expect, beforeEach } from 'vitest';
import { useOrchestrationStore, BridgeNode } from './orchestrationStore';

describe('useOrchestrationStore', () => {
  const initialNodes: BridgeNode[] = [
    { nodeId: 'node1', nodeName: 'Node 1', capabilities: ['chat'], online: true, color: '#ff0000' },
    { nodeId: 'node2', nodeName: 'Node 2', capabilities: ['chat'], online: true, color: '#00ff00' },
    { nodeId: 'node3', nodeName: 'Node 3', capabilities: ['chat'], online: false, color: '#0000ff' },
  ];

  beforeEach(() => {
    // Reset store state before each test
    useOrchestrationStore.setState({
      mode: 'single',
      nodes: [],
      selectedNodeIds: [],
      pipelineOrder: [],
      activeJob: null,
      nodeTrayOpen: false,
    });
  });

  describe('setMode', () => {
    it('should set mode and update nodeTrayOpen accordingly', () => {
      const store = useOrchestrationStore.getState();

      store.setMode('parallel');
      expect(useOrchestrationStore.getState().mode).toBe('parallel');
      expect(useOrchestrationStore.getState().nodeTrayOpen).toBe(true);

      store.setMode('single');
      expect(useOrchestrationStore.getState().mode).toBe('single');
      expect(useOrchestrationStore.getState().nodeTrayOpen).toBe(false);
    });
  });

  describe('syncNodes', () => {
    it('should handle first sync by selecting all online nodes', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      const state = useOrchestrationStore.getState();
      expect(state.nodes).toEqual(initialNodes);
      expect(state.selectedNodeIds).toEqual(['node1', 'node2']);
      expect(state.pipelineOrder).toEqual(['node1', 'node2', 'node3']);
    });

    it('should preserve selections on subsequent syncs and auto-select new online nodes', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      // User deselects node1
      useOrchestrationStore.getState().toggleNode('node1');
      expect(useOrchestrationStore.getState().selectedNodeIds).toEqual(['node2']);

      // Sync with a new online node
      const newNodes: BridgeNode[] = [
        ...initialNodes,
        { nodeId: 'node4', nodeName: 'Node 4', capabilities: ['chat'], online: true, color: '#ffff00' }
      ];

      useOrchestrationStore.getState().syncNodes(newNodes);

      const state = useOrchestrationStore.getState();
      // node1 is still deselected, node2 is preserved, node4 is newly auto-selected
      expect(state.selectedNodeIds).toEqual(['node2', 'node4']);
      // Pipeline order appends new nodes
      expect(state.pipelineOrder).toEqual(['node1', 'node2', 'node3', 'node4']);
    });

    it('should remove missing nodes from selections and pipeline order', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      // Sync with node2 missing
      const newNodes: BridgeNode[] = [
        initialNodes[0],
        initialNodes[2]
      ];

      useOrchestrationStore.getState().syncNodes(newNodes);

      const state = useOrchestrationStore.getState();
      expect(state.selectedNodeIds).toEqual(['node1']);
      expect(state.pipelineOrder).toEqual(['node1', 'node3']);
    });
  });

  describe('toggleNode', () => {
    it('should toggle a node selection', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      // Initial state has node1 selected
      expect(useOrchestrationStore.getState().selectedNodeIds.includes('node1')).toBe(true);

      // Toggle node1 off
      useOrchestrationStore.getState().toggleNode('node1');
      expect(useOrchestrationStore.getState().selectedNodeIds.includes('node1')).toBe(false);

      // Toggle node1 on
      useOrchestrationStore.getState().toggleNode('node1');
      expect(useOrchestrationStore.getState().selectedNodeIds.includes('node1')).toBe(true);
    });
  });

  describe('selectAllNodes', () => {
    it('should select all online nodes', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      // Deselect all
      useOrchestrationStore.getState().clearNodeSelection();
      expect(useOrchestrationStore.getState().selectedNodeIds).toEqual([]);

      useOrchestrationStore.getState().selectAllNodes(initialNodes);
      expect(useOrchestrationStore.getState().selectedNodeIds).toEqual(['node1', 'node2']);
    });
  });

  describe('clearNodeSelection', () => {
    it('should clear all selected nodes', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      expect(useOrchestrationStore.getState().selectedNodeIds.length).toBeGreaterThan(0);

      useOrchestrationStore.getState().clearNodeSelection();
      expect(useOrchestrationStore.getState().selectedNodeIds).toEqual([]);
    });
  });

  describe('movePipelineNode', () => {
    it('should reorder pipeline nodes correctly', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      expect(useOrchestrationStore.getState().pipelineOrder).toEqual(['node1', 'node2', 'node3']);

      useOrchestrationStore.getState().movePipelineNode(0, 2);
      expect(useOrchestrationStore.getState().pipelineOrder).toEqual(['node2', 'node3', 'node1']);

      useOrchestrationStore.getState().movePipelineNode(2, 0);
      expect(useOrchestrationStore.getState().pipelineOrder).toEqual(['node1', 'node2', 'node3']);
    });
  });

  describe('setActiveJob', () => {
    it('should set the active job', () => {
      const job = { id: 'job1', type: 'parallel', status: 'running' } as any;
      const store = useOrchestrationStore.getState();

      store.setActiveJob(job);
      expect(useOrchestrationStore.getState().activeJob).toEqual(job);

      useOrchestrationStore.getState().setActiveJob(null);
      expect(useOrchestrationStore.getState().activeJob).toBeNull();
    });
  });

  describe('setNodeTrayOpen', () => {
    it('should set the node tray open state', () => {
      const store = useOrchestrationStore.getState();

      store.setNodeTrayOpen(true);
      expect(useOrchestrationStore.getState().nodeTrayOpen).toBe(true);

      store.setNodeTrayOpen(false);
      expect(useOrchestrationStore.getState().nodeTrayOpen).toBe(false);
    });
  });

  describe('onlineNodes', () => {
    it('should return only online nodes', () => {
      const store = useOrchestrationStore.getState();
      store.syncNodes(initialNodes);

      const onlineNodes = useOrchestrationStore.getState().onlineNodes();
      expect(onlineNodes).toHaveLength(2);
      expect(onlineNodes.map(n => n.nodeId)).toEqual(['node1', 'node2']);
    });
  });
});
