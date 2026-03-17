# Bridge Cloud — Frontend Architecture Specification

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Zustand v5, Lucide React
**Purpose:** Minimalistic ChatGPT-like AI chat app. Supports multiple AI agents (Claude, Gemini, Codex, Qwen, Free Bot). Fake-streaming mock API for local dev; real SSE integration slot left open.

---

## 1. File & Folder Structure

Every file that must be created under `src/`:

```
src/
├── app/
│   ├── layout.tsx                        # Root layout (fonts, dark mode class, global providers)
│   ├── globals.css                       # Tailwind base + custom CSS vars
│   ├── page.tsx                          # Redirect → /chat
│   ├── chat/
│   │   ├── layout.tsx                    # Chat shell layout (sidebar + main area, full height)
│   │   ├── page.tsx                      # /chat — new conversation landing (empty state)
│   │   └── [id]/
│   │       └── page.tsx                  # /chat/[id] — active conversation view
│   └── favicon.ico
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx                  # Outer flex container (sidebar + content)
│   │   ├── Sidebar.tsx                   # Left panel: agent picker, conversation list, new chat btn
│   │   └── MainArea.tsx                  # Right panel: message list + input bar
│   │
│   ├── chat/
│   │   ├── ConversationList.tsx          # Scrollable list of past conversations in sidebar
│   │   ├── ConversationItem.tsx          # Single row: title, timestamp, active highlight
│   │   ├── MessageList.tsx               # Scrollable message feed, auto-scroll to bottom
│   │   ├── MessageBubble.tsx             # Single message: user vs assistant styling
│   │   ├── TypingIndicator.tsx           # Animated dots shown while bot is "thinking"
│   │   └── EmptyState.tsx               # Shown on /chat when no conversation is active
│   │
│   ├── input/
│   │   ├── ChatInputBar.tsx              # Textarea + send button + agent badge
│   │   └── SendButton.tsx               # Icon button with loading/idle state
│   │
│   ├── agent/
│   │   ├── AgentPicker.tsx               # Dropdown/list to switch active agent
│   │   └── AgentBadge.tsx               # Small colored pill showing current agent name
│   │
│   └── ui/
│       ├── Button.tsx                    # Base button (variants: primary, ghost, icon)
│       ├── ScrollArea.tsx                # Thin-scrollbar wrapper div
│       └── Tooltip.tsx                   # Simple hover tooltip
│
├── store/
│   └── chatStore.ts                      # Zustand store — all chat state and actions
│
├── lib/
│   ├── agents.ts                         # Agent definitions list (id, name, color, icon)
│   ├── mockApi.ts                        # Fake streaming response generator
│   ├── streaming.ts                      # Character-by-character stream consumer
│   └── utils.ts                          # cn() helper (clsx + tailwind-merge), formatDate
│
└── types/
    └── index.ts                          # All shared TypeScript interfaces
```

---

## 2. TypeScript Interfaces

File: `src/types/index.ts`

```typescript
// Role of a message sender
export type MessageRole = 'user' | 'assistant' | 'system';

// A single chat message
export interface Message {
  id: string;                   // nanoid or crypto.randomUUID()
  conversationId: string;       // FK → Conversation.id
  role: MessageRole;
  content: string;              // Final or in-progress streamed content
  agentId: string | null;       // Which agent sent this (null for user messages)
  createdAt: number;            // Unix ms timestamp
  isStreaming: boolean;         // True while the mock API is still emitting chars
}

// A conversation thread
export interface Conversation {
  id: string;                   // nanoid
  title: string;                // Auto-generated from first user message (first 40 chars)
  agentId: string;              // Which agent this conversation uses
  messages: Message[];          // Ordered oldest-first
  createdAt: number;
  updatedAt: number;
}

// An AI agent entry
export interface Agent {
  id: string;                   // 'claude' | 'gemini' | 'codex' | 'qwen' | 'free'
  name: string;                 // Display name, e.g. "Claude"
  description: string;          // Short tagline, e.g. "Anthropic · Sonnet 4.5"
  color: string;                // Tailwind bg class for badge, e.g. "bg-violet-500"
  iconName: string;             // Lucide icon name, e.g. "Bot", "Sparkles", "Code2"
  endpoint: string;             // Real API URL (unused in mock mode), e.g. "http://localhost:8585"
  available: boolean;           // Show/hide in picker — set false to gray out
}

// Zustand store shape (see Section 3 for full implementation)
export interface ChatStore {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  activeAgentId: string;
  isStreaming: boolean;

  // Derived getters
  activeConversation: () => Conversation | null;
  activeAgent: () => Agent;

  // Actions
  newConversation: () => string;                       // returns new conversation id
  setActiveConversation: (id: string) => void;
  setActiveAgent: (agentId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
}
```

---

## 3. Zustand Store

File: `src/store/chatStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatStore, Conversation, Message } from '@/types';
import { AGENTS } from '@/lib/agents';
import { streamMockResponse } from '@/lib/mockApi';

function generateId(): string {
  return crypto.randomUUID();
}

function generateTitle(content: string): string {
  return content.slice(0, 40).trim() + (content.length > 40 ? '…' : '');
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // ── State ────────────────────────────────────────────────────────────────
      conversations: [],
      activeConversationId: null,
      activeAgentId: 'claude',   // default agent
      isStreaming: false,

      // ── Derived ──────────────────────────────────────────────────────────────
      activeConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },

      activeAgent: () => {
        const { activeAgentId } = get();
        return AGENTS.find((a) => a.id === activeAgentId) ?? AGENTS[0];
      },

      // ── Actions ───────────────────────────────────────────────────────────────

      newConversation: () => {
        const { activeAgentId } = get();
        const id = generateId();
        const now = Date.now();
        const conversation: Conversation = {
          id,
          title: 'New conversation',
          agentId: activeAgentId,
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id: string) => {
        set({ activeConversationId: id });
      },

      setActiveAgent: (agentId: string) => {
        set({ activeAgentId: agentId });
      },

      sendMessage: async (content: string) => {
        const store = get();
        if (store.isStreaming) return;

        // Ensure there is an active conversation, create one if not
        let convId = store.activeConversationId;
        if (!convId) {
          convId = store.newConversation();
        }

        const agentId = get().activeAgentId;
        const now = Date.now();

        // 1. Append the user message
        const userMessage: Message = {
          id: generateId(),
          conversationId: convId,
          role: 'user',
          content,
          agentId: null,
          createdAt: now,
          isStreaming: false,
        };

        // 2. Create a placeholder assistant message (empty, streaming=true)
        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          conversationId: convId,
          role: 'assistant',
          content: '',
          agentId,
          createdAt: now + 1,
          isStreaming: true,
        };

        // Update title from first user message
        set((state) => ({
          isStreaming: true,
          conversations: state.conversations.map((c) => {
            if (c.id !== convId) return c;
            const isFirst = c.messages.length === 0;
            return {
              ...c,
              title: isFirst ? generateTitle(content) : c.title,
              messages: [...c.messages, userMessage, assistantMessage],
              updatedAt: Date.now(),
            };
          }),
        }));

        // 3. Stream chars into the assistant message
        try {
          await streamMockResponse(content, agentId, (chunk: string) => {
            set((state) => ({
              conversations: state.conversations.map((c) => {
                if (c.id !== convId) return c;
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: m.content + chunk }
                      : m
                  ),
                };
              }),
            }));
          });
        } finally {
          // 4. Mark streaming done
          set((state) => ({
            isStreaming: false,
            conversations: state.conversations.map((c) => {
              if (c.id !== convId) return c;
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                ),
                updatedAt: Date.now(),
              };
            }),
          }));
        }
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const remaining = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: remaining,
            activeConversationId:
              state.activeConversationId === id
                ? (remaining[0]?.id ?? null)
                : state.activeConversationId,
          };
        });
      },

      clearAll: () => {
        set({ conversations: [], activeConversationId: null });
      },
    }),
    {
      name: 'bridge-cloud-chat',    // localStorage key
      partialize: (state) => ({     // only persist data, not functions
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        activeAgentId: state.activeAgentId,
      }),
    }
  )
);
```

---

## 4. Agent List

File: `src/lib/agents.ts`

```typescript
import type { Agent } from '@/types';

export const AGENTS: Agent[] = [
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic · claude-sonnet-4-5',
    color: 'bg-violet-500',
    iconName: 'Sparkles',
    endpoint: 'http://localhost:8585',
    available: true,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google · gemini-2.0-flash',
    color: 'bg-blue-500',
    iconName: 'Zap',
    endpoint: 'http://localhost:8586',
    available: true,
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'OpenAI · gpt-4o',
    color: 'bg-emerald-500',
    iconName: 'Code2',
    endpoint: 'http://localhost:8587',
    available: true,
  },
  {
    id: 'qwen',
    name: 'Qwen',
    description: 'Alibaba · Qwen 2.5',
    color: 'bg-orange-500',
    iconName: 'Bot',
    endpoint: 'http://localhost:8588',
    available: true,
  },
  {
    id: 'free',
    name: 'Free Bot',
    description: 'Mistral · free tier',
    color: 'bg-rose-500',
    iconName: 'Coins',
    endpoint: 'http://localhost:8590',
    available: true,
  },
];

export function getAgent(id: string): Agent {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}
```

---

## 5. Mock API — Fake Streaming

File: `src/lib/mockApi.ts`

```typescript
// Returns a fake reply string based on the user's message and agent.
// Randomizes slightly per agent to feel distinct.

const RESPONSES: Record<string, string[]> = {
  claude: [
    "That's an interesting question. Let me think through it carefully. The core idea here is that systems which handle complexity well tend to have clear separation of concerns — each part knows its job and does it without leaking state into adjacent layers.",
    "I'd approach this by breaking the problem into smaller, independently testable units. Start with the data model, then the state transitions, then the presentation. That order matters because each layer builds on the last.",
    "There are a few ways to look at this. The pragmatic answer is to ship something working first, then iterate. The principled answer is to design the interface before the implementation. Both are right depending on context.",
  ],
  gemini: [
    "Great question! Here's what I know: the answer really depends on scale. At small scale, simplicity wins every time. At large scale, you need structure — clear contracts between services, well-typed interfaces, and reliable error paths.",
    "I can help with that. The key insight is that most problems in software are communication problems in disguise — between modules, between teams, between systems. Good architecture is really just good communication design.",
    "Let me break that down for you. First, consider the happy path. Then enumerate failure modes. Then ask: which failures are acceptable and which are catastrophic? That framing usually makes the solution obvious.",
  ],
  codex: [
    "Here's a concise implementation:\n\n```typescript\nfunction solve(input: string): string {\n  // parse → transform → serialize\n  return input.trim().toLowerCase();\n}\n```\n\nThis is idiomatic and handles edge cases cleanly.",
    "The algorithm runs in O(n log n) time. The bottleneck is the sort step — if you can avoid sorting, you can get this down to O(n) with a hash map approach.",
    "Three things to check: 1) Are you handling the null case? 2) Is the type guard exhaustive? 3) Does the async path propagate errors correctly? Usually one of these is the root cause.",
  ],
  qwen: [
    "Understood. Based on the context, the optimal strategy is to prioritize correctness over performance initially. Once the logic is proven correct, profiling will reveal the actual bottlenecks rather than the assumed ones.",
    "This pattern is common in distributed systems. The standard solution is idempotency keys — ensure every mutation is safe to retry. Combined with optimistic locking, you get strong consistency without sacrificing availability.",
    "The answer is nuanced. On one hand, the theoretical approach suggests X. On the other hand, practical constraints often push teams toward Y. The right call depends on your team's familiarity and your system's reliability requirements.",
  ],
  free: [
    "Sure! The short answer: keep it simple until you can't. Complexity should be a last resort, not a first instinct.",
    "Good point. I think the best way to handle this is iteratively — make a small bet, measure the result, adjust. Avoid big-bang designs whenever you can.",
    "Honestly, the best resource for this is just doing it and seeing what breaks. Theory only gets you so far. Build the simplest version, run it, and let reality teach you the rest.",
  ],
};

function pickResponse(agentId: string): string {
  const pool = RESPONSES[agentId] ?? RESPONSES['claude'];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Simulates a streaming response by calling onChunk with one character
 * (or small token) at a time, with randomized delay between chunks.
 *
 * @param userMessage - The user's input (used to optionally customize reply)
 * @param agentId     - Which agent is responding
 * @param onChunk     - Callback called with each character chunk
 * @returns           - Resolves when streaming is complete
 */
export async function streamMockResponse(
  userMessage: string,
  agentId: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  // Optionally echo the topic for variety
  const baseReply = pickResponse(agentId);
  const reply = userMessage.length < 20
    ? `Re: "${userMessage}" — ` + baseReply
    : baseReply;

  // Split into tokens of 1–3 chars for natural streaming feel
  const tokens = tokenize(reply);

  for (const token of tokens) {
    onChunk(token);
    // Random delay: 18–55ms between tokens to simulate real LLM speed
    await delay(Math.floor(Math.random() * 37) + 18);
  }
}

/** Split string into small overlapping word-pieces (simulates token stream) */
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < text.length) {
    // Emit 1–4 chars at a time; weight toward 2–3 for realism
    const size = weightedSize();
    tokens.push(text.slice(i, i + size));
    i += size;
  }
  return tokens;
}

function weightedSize(): number {
  const r = Math.random();
  if (r < 0.15) return 1;
  if (r < 0.45) return 2;
  if (r < 0.80) return 3;
  return 4;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

## 6. Streaming Utility

File: `src/lib/streaming.ts`

This file is the slot for **real SSE integration** when the mock is replaced by actual bot servers.

```typescript
/**
 * Real SSE streaming consumer — connects to a bot server's /stream endpoint
 * and calls onChunk for each text delta received.
 *
 * Currently unused in mock mode. Swap streamMockResponse for this when
 * real servers are live.
 */
export async function streamFromEndpoint(
  endpoint: string,
  userMessage: string,
  conversationId: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const url = `${endpoint}/stream`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, conversation_id: conversationId }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Stream request failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    // Parse SSE format: lines starting with "data: "
    for (const line of text.split('\n')) {
      if (line.startsWith('data: ')) {
        const chunk = line.slice(6);
        if (chunk === '[DONE]') return;
        onChunk(chunk);
      }
    }
  }
}
```

---

## 7. Utility Helpers

File: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a Unix ms timestamp as a short relative time string */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/** Truncate a string to maxLength chars with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}
```

---

## 8. Routing (App Router)

### Route Map

| URL | File | Purpose |
|-----|------|---------|
| `/` | `src/app/page.tsx` | Immediate redirect to `/chat` |
| `/chat` | `src/app/chat/page.tsx` | Landing: empty state, no active conversation |
| `/chat/[id]` | `src/app/chat/[id]/page.tsx` | Active conversation view |

### Route Implementations

**`src/app/page.tsx`**
```typescript
import { redirect } from 'next/navigation';
export default function Root() {
  redirect('/chat');
}
```

**`src/app/chat/layout.tsx`** — Chat shell (server component, wraps all /chat routes)
```typescript
// Renders AppShell with Sidebar + {children} in MainArea slot.
// Sidebar is always visible; only the right panel changes between routes.
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

**`src/app/chat/page.tsx`** — Empty state
```typescript
// Shows EmptyState component (prompt the user to start a conversation)
// useEffect: if there are existing conversations, redirect to the most recent one
```

**`src/app/chat/[id]/page.tsx`** — Conversation view
```typescript
// params.id → call store.setActiveConversation(id) on mount
// Renders: <MessageList conversationId={id} /> + <ChatInputBar />
// If id doesn't exist in store, redirect to /chat
```

### URL ↔ Store Sync Strategy

- When the user clicks "New Chat" in Sidebar: `store.newConversation()` returns the new id, then `router.push('/chat/' + id)`
- When the user clicks a conversation in ConversationList: `router.push('/chat/' + id)`
- When `[id]/page.tsx` mounts: `store.setActiveConversation(params.id)` syncs the store to the URL
- On hard refresh: the page reads `params.id`, syncs to store, hydrates from localStorage via Zustand `persist`

---

## 9. Component Tree

```
RootLayout (app/layout.tsx)
└── ChatLayout (app/chat/layout.tsx)
    └── AppShell (components/layout/AppShell.tsx)
        ├── Sidebar (components/layout/Sidebar.tsx)
        │   ├── AgentPicker (components/agent/AgentPicker.tsx)
        │   │   └── AgentBadge (components/agent/AgentBadge.tsx)  [×5, one per agent]
        │   ├── Button "New Chat" (components/ui/Button.tsx)
        │   └── ConversationList (components/chat/ConversationList.tsx)
        │       └── ConversationItem (components/chat/ConversationItem.tsx)  [×n]
        │
        └── MainArea (components/layout/MainArea.tsx)
            │
            ├── [on /chat]  EmptyState (components/chat/EmptyState.tsx)
            │
            └── [on /chat/[id]]
                ├── MessageList (components/chat/MessageList.tsx)
                │   ├── MessageBubble (components/chat/MessageBubble.tsx)  [×n]
                │   │   └── AgentBadge (inline, shows which agent replied)
                │   └── TypingIndicator (components/chat/TypingIndicator.tsx)
                │       [shown when isStreaming && last message is empty assistant msg]
                └── ChatInputBar (components/input/ChatInputBar.tsx)
                    ├── AgentBadge (current agent pill)
                    └── SendButton (components/input/SendButton.tsx)
```

---

## 10. Component Contracts

### `AppShell`
```typescript
// Props: { children: React.ReactNode }
// Layout: flex h-screen. Sidebar fixed width (260px). MainArea fills rest.
// Dark mode: bg-zinc-950 sidebar, bg-zinc-900 main
```

### `Sidebar`
```typescript
// No props — reads from useChatStore
// Sections: logo + agent picker | new chat button | conversation list (scrollable)
```

### `AgentPicker`
```typescript
// No props
// Renders a dropdown or popover listing all AGENTS
// On select: store.setActiveAgent(id)
// Shows current agent highlighted
```

### `AgentBadge`
```typescript
interface AgentBadgeProps {
  agentId: string;
  size?: 'sm' | 'md';         // sm = sidebar/input, md = message bubble
}
// Renders: colored dot + agent name. Color from agent.color.
```

### `ConversationList`
```typescript
// No props — reads store.conversations
// Sorted by updatedAt descending
// Renders ConversationItem for each
```

### `ConversationItem`
```typescript
interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}
// Click: router.push('/chat/' + conversation.id)
// Shows: title (truncated), formatRelativeTime(updatedAt), agent color dot
```

### `MessageList`
```typescript
interface MessageListProps {
  conversationId: string;
}
// Reads conversation from store by id
// useEffect: scroll to bottom whenever messages.length changes or isStreaming changes
// Ref: scrollAreaRef on outer div
```

### `MessageBubble`
```typescript
interface MessageBubbleProps {
  message: Message;
}
// role === 'user': right-aligned, bg-zinc-700 bubble
// role === 'assistant': left-aligned, no bubble (flat), shows AgentBadge above content
// message.isStreaming && content === '': show TypingIndicator instead of content
// message.isStreaming && content !== '': show content + blinking cursor (::after CSS)
```

### `ChatInputBar`
```typescript
// No props
// Controlled textarea (auto-grows to 5 lines max)
// Submit on Enter (Shift+Enter = newline)
// Disabled while store.isStreaming
// On submit: store.sendMessage(value) then clear input
```

### `TypingIndicator`
```typescript
// No props
// Three bouncing dots (CSS animation: opacity 0→1→0, staggered 0ms/150ms/300ms)
```

---

## 11. State Flow Diagram

```
User types message → ChatInputBar onSubmit
  → store.sendMessage(content)
    → ensures activeConversationId exists (creates if null)
    → appends userMessage to conversation.messages
    → appends assistantMessage { content: '', isStreaming: true }
    → sets store.isStreaming = true
    → calls streamMockResponse(content, agentId, onChunk)
      → onChunk called every ~25ms with 1–4 chars
        → store updates: assistantMessage.content += chunk
          → React re-renders MessageBubble with new content
    → on complete: assistantMessage.isStreaming = false, store.isStreaming = false
```

---

## 12. Styling Conventions

- **Color scheme:** zinc-900/950 backgrounds (dark-first), zinc-100/200 text on dark
- **Sidebar:** `w-[260px] shrink-0 bg-zinc-950 border-r border-zinc-800`
- **Main area:** `flex-1 flex flex-col bg-zinc-900`
- **Message feed:** `flex-1 overflow-y-auto px-6 py-4 space-y-4`
- **Input bar:** `border-t border-zinc-800 bg-zinc-950 px-4 py-3`
- **User bubble:** `ml-auto max-w-[70%] rounded-2xl bg-zinc-700 px-4 py-2.5 text-sm text-zinc-100`
- **Assistant reply:** `max-w-[80%] text-sm text-zinc-200 leading-relaxed`
- **Streaming cursor:** CSS `@keyframes blink` on a `::after` pseudo-element (width: 2px, height: 1em, bg: current color)
- **Active conversation:** `bg-zinc-800` highlight in sidebar list
- **Agent badge sizes:** sm = `text-xs px-2 py-0.5 rounded-full`, md = `text-sm px-2.5 py-1 rounded-full`

---

## 13. Local Storage / Persistence

Zustand `persist` middleware writes `conversations[]`, `activeConversationId`, and `activeAgentId` to `localStorage` under key `bridge-cloud-chat`.

On app boot:
1. Zustand rehydrates from localStorage automatically.
2. If `activeConversationId` is set, `[id]/page.tsx` syncs the URL to match.
3. If localStorage is empty (first visit), the app lands on `/chat` with `EmptyState`.

Messages are stored inline on `Conversation.messages` — no separate messages table needed at this scale.

---

## 14. Build Order (Implementation Sequence)

1. `src/types/index.ts` — interfaces first, everything else depends on them
2. `src/lib/agents.ts` — static data, no dependencies
3. `src/lib/utils.ts` — helpers
4. `src/lib/mockApi.ts` — fake streaming
5. `src/lib/streaming.ts` — real SSE slot (stub only initially)
6. `src/store/chatStore.ts` — store (depends on types + agents + mockApi)
7. UI components bottom-up: `ui/` → `agent/` → `chat/` → `input/` → `layout/`
8. Route pages: `app/chat/layout.tsx` → `app/chat/page.tsx` → `app/chat/[id]/page.tsx` → `app/page.tsx`
