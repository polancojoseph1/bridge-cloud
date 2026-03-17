import type { Agent } from '@/types';

export const AGENTS: Agent[] = [
  { id: 'claude', name: 'Claude', description: 'Anthropic · claude-sonnet-4-5', color: 'bg-violet-500', dotColor: '#7dd3a8', iconName: 'Sparkles', endpoint: 'http://localhost:8585', available: true },
  { id: 'gemini', name: 'Gemini', description: 'Google · gemini-2.0-flash', color: 'bg-blue-500', dotColor: '#8ab4f8', iconName: 'Zap', endpoint: 'http://localhost:8586', available: true },
  { id: 'codex', name: 'Codex', description: 'OpenAI · gpt-4o', color: 'bg-emerald-500', dotColor: '#10a37f', iconName: 'Code2', endpoint: 'http://localhost:8587', available: true },
  { id: 'qwen', name: 'Qwen', description: 'Alibaba · Qwen 2.5', color: 'bg-orange-500', dotColor: '#c084fc', iconName: 'Bot', endpoint: 'http://localhost:8588', available: true },
  { id: 'free', name: 'Free Bot', description: 'Mistral · free tier', color: 'bg-rose-500', dotColor: '#fb923c', iconName: 'Coins', endpoint: 'http://localhost:8590', available: true },
];

export const AGENT_DOT_COLORS: Record<string, string> = Object.fromEntries(
  AGENTS.map(a => [a.id, a.dotColor])
);

export function getAgent(id: string): Agent {
  return AGENTS.find(a => a.id === id) ?? AGENTS[0];
}
