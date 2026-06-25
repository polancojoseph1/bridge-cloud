'use client';

import ProviderSelector from './ProviderSelector';
import ModePill from '@/components/orchestration/ModePill';
import NodeTray from '@/components/orchestration/NodeTray';

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  return (
    <div className="flex-1 flex justify-between items-center gap-3">
      <div className="flex items-center ml-2 relative gap-3">
        <ModePill />
        <NodeTray />
      </div>
      {/* Agent selector right aligned */}
      <div className="flex items-center">
        <ProviderSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>
    </div>
  );
}
