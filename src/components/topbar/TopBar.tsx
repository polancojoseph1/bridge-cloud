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
      {/* Left: Agent selector */}
      <div className="flex items-center">
        <AgentSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>

      {/* Right: Authentication */}
      <div className="ml-auto flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-[#8e8e8e] hover:text-[#ececec] transition-colors">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-medium bg-[#1e3025] hover:bg-[#2a4334] text-[#ececec] px-3 py-1.5 rounded-md transition-colors">
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
