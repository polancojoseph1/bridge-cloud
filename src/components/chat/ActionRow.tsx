'use client';

import {
  Loader2,
  Terminal,
  FileEdit,
  FilePlus,
  FileText,
  FolderOpen,
  Search,
  Globe,
  Bot,
  CheckCircle2,
  XCircle,
  Wrench,
  Zap,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// Strip emoji / Unicode symbol characters from progress text emitted by the backend
function stripEmoji(s: string): string {
  return s
    .replace(
      /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}]/gu,
      '',
    )
    .trim();
}

type ActionType =
  | 'thinking'
  | 'shell'
  | 'edit'
  | 'write'
  | 'read'
  | 'list'
  | 'grep'
  | 'fetch'
  | 'search'
  | 'agent'
  | 'agent-done'
  | 'error'
  | 'narration'
  | 'tool'
  | 'generic';

interface ParsedAction {
  type: ActionType;
  label: string;
  detail: string;
}

const PREFIX_TO_TYPE: Record<string, ActionType> = {
  shell: 'shell',
  bash: 'shell',
  edit: 'edit',
  write: 'write',
  read: 'read',
  list: 'list',
  grep: 'grep',
  fetch: 'fetch',
  search: 'search',
  'sub-agent': 'agent',
  subagent: 'agent',
  'sub agent': 'agent',
};

function parseProgressLine(raw: string): ParsedAction {
  const text = stripEmoji(raw).trim();

  if (!text) return { type: 'generic', label: '', detail: '' };

  // "Thinking..." / "Still working..."
  if (/^(thinking|still working)\.\.\./i.test(text)) {
    return { type: 'thinking', label: 'Thinking', detail: '' };
  }

  // "[Sub-agent N done]"
  if (/^\[sub-agent \d+ done\]/i.test(text)) {
    return { type: 'agent-done', label: 'Sub-agent done', detail: '' };
  }

  // "<runner> unavailable — trying <runner>..."
  if (/unavailable.*trying/i.test(text)) {
    return { type: 'tool', label: text, detail: '' };
  }

  // "Label: detail" pattern
  const colonIdx = text.indexOf(':');
  if (colonIdx > 0 && colonIdx < 20) {
    const prefix = text.slice(0, colonIdx).trim().toLowerCase();
    const detail = text.slice(colonIdx + 1).trim();
    const type = PREFIX_TO_TYPE[prefix];
    if (type) {
      const label = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      return { type, label, detail };
    }
  }

  // Fallback: treat as generic narration (dimmed)
  return { type: 'narration', label: text, detail: '' };
}

const ICON_MAP: Record<ActionType, React.ComponentType<{ className?: string }>> = {
  thinking: Loader2,
  shell: Terminal,
  edit: FileEdit,
  write: FilePlus,
  read: FileText,
  list: FolderOpen,
  grep: Search,
  fetch: Globe,
  search: Search,
  agent: Bot,
  'agent-done': CheckCircle2,
  error: XCircle,
  narration: BrainCircuit,
  tool: Wrench,
  generic: Zap,
};

interface ActionRowProps {
  raw: string;
}

export default function ActionRow({ raw }: ActionRowProps) {
  const action = parseProgressLine(raw);
  const Icon = ICON_MAP[action.type];

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        action.type === 'thinking' && 'text-blue-400',
        action.type === 'error' && 'text-red-400',
        action.type === 'narration' && 'text-gray-500',
      )}
    >
      <Icon className={cn('h-4 w-4 flex-shrink-0', action.type === 'thinking' && 'animate-spin')} />
      <span>
        {action.label}
        {action.detail && <span className="text-gray-400"> {action.detail}</span>}
      </span>
    </div>
  );
}