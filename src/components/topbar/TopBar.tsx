'use client';

import ProviderSelector from './ProviderSelector';
import ModePill from '@/components/orchestration/ModePill';

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  return (
    <div className="flex-1 flex justify-between items-center">
      {/* Orchestration Mode Pill left aligned */}
      <div className="flex items-center">
        <ModePill />
      </div>

      {/* Agent selector right aligned */}
      <div className="flex items-center gap-3">
        <ProviderSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>
    </div>
  );
}
