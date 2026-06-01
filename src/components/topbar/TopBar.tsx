'use client';

import ProviderSelector from './ProviderSelector';

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  return (
    <div className="flex-1 flex justify-end items-center gap-3">
      {/* Agent selector right aligned */}
      <div className="flex items-center">
        <ProviderSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>
    </div>
  );
}
