'use client';

import ProviderSelector from './ProviderSelector';
import ModePill from '@/components/orchestration/ModePill';

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  return (
    <div className="flex-1 flex justify-end items-center gap-3">
      <div className="flex items-center gap-4">
        <ModePill />
        <ProviderSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>
    </div>
  );
}
