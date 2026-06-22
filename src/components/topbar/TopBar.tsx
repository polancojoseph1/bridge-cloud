
'use client';

import ProviderSelector from './ProviderSelector';
import ModePill from "@/components/orchestration/ModePill";
import NodeTray from "@/components/orchestration/NodeTray";
import { useOrchestrationStore } from "@/store/orchestrationStore";

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  const isOrchestrating = useOrchestrationStore(s => s.mode) !== 'single';
  const toggleNodeTray = () => useOrchestrationStore.getState().setNodeTrayOpen(!useOrchestrationStore.getState().nodeTrayOpen);

  return (
    <div className="flex-1 flex justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <ModePill />
        {isOrchestrating && (
          <button
            onClick={toggleNodeTray}
            className="px-3 py-1.5 text-[12px] font-medium text-[#ececec] bg-[#1e2a4a] hover:bg-[#2c3b6a] rounded-md transition-colors border border-[#2d4055]"
          >
            Manage Nodes
          </button>
        )}
      </div>
      <div className="flex items-center">
        <ProviderSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>
      <NodeTray />
    </div>
  );
}
