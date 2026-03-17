import { cn } from '@/lib/cn';
import { getAgent } from '@/lib/agents';

interface AgentBadgeProps {
  agentId: string;
  size?: 'sm' | 'md';
}

export default function AgentBadge({ agentId, size = 'sm' }: AgentBadgeProps) {
  const agent = getAgent(agentId);
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium',
      size === 'sm' ? 'text-[11px]' : 'text-[13px] gap-2'
    )}>
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: size === 'sm' ? 6 : 8,
          height: size === 'sm' ? 6 : 8,
          backgroundColor: agent.dotColor,
        }}
      />
      <span className="text-[#8e8e8e]">{agent.name}</span>
    </span>
  );
}
