'use client';

import AgentSelector from './AgentSelector';

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  return (
    <header
      className="h-12 flex items-center px-4 flex-shrink-0 border-b border-[#1e3025] bg-[#0a1410]"
      style={{ minHeight: '48px' }}
    >
      {/* Right side contents container aligned to end */}
      <div className="ml-auto flex items-center gap-3">
        {/* Agent selector moved to the right */}
        <div className="flex items-center">
          <AgentSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
        </div>
      </div>
    </header>
  );
}