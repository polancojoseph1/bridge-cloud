# Bridge Cloud — Unified Build Brief
**Version:** 2026-03-17
**Status:** Ready for parallel implementation
**Developers:** A (BridgeBot backend), B (Next.js proxy + store), C (Frontend UI)

---

## Codebase Baseline (read before touching anything)

| File | Current state |
|---|---|
| `src/types/index.ts` | Has `Message`, `Conversation`, `Agent`, `ChatStore`. No server types yet. |
| `src/store/chatStore.ts` | Zustand + persist. Uses `streamMockResponse`. No `serverStore` yet. |
| `src/lib/streaming.ts` | Stub. Throws on call. Must be replaced by Dev B. |
| `src/lib/agents.ts` | Static `AGENTS` array with hardcoded localhost endpoints. NOT touched by this sprint. |
| `src/app/api/chat/route.ts` | Existing mock SSE route. NOT replaced — left as-is. |
| `src/components/layout/AppShell.tsx` | Renders Sidebar + Header + children. Dev C adds gate guard here. |
| `src/components/layout/Sidebar.tsx` | Has AgentSelector + ConversationList. Dev C adds server status indicator. |
| BridgeBot `server.py` | FastAPI app. Has `/health`, `/query` (auth with `INTERNAL_API_KEY` + `X-API-Key`). No `/v1/` routes yet. |

---

## Section A — Canonical Types

**Decision:** Use `ServerProfile` (workflow spec name, more complete shape). Merge `agentId` from the API spec. The name `ServerConfig` from the API spec is DISCARDED — do not use it anywhere.

Add the following to the **bottom** of `/Users/openclaw/Desktop/Jefe/Projects/bridge-cloud/src/types/index.ts`. Do not modify any existing types.

```typescript
// ── Server profile ────────────────────────────────────────────────────────────

export type HealthStatus = 'healthy' | 'degraded' | 'offline' | 'unknown';
export type CloudProvisionStatus = 'provisioning' | 'active' | 'error';

export interface ServerProfile {
  id: string;                          // nanoid, e.g. "sp_abc123"
  name: string;                        // user-visible label, e.g. "Jefe's Claude"
  agentId: string;                     // maps to Agent.id — "claude" | "gemini" | "codex" | "qwen" | "free"
  url: string;                         // BridgeBot base URL, e.g. "https://host:8585"
  apiKey: string;                      // bc_live_<hex32> value
  isDefault: boolean;
  lastHealthStatus: HealthStatus;
  lastCheckedAt: number | null;        // epoch ms, null = never checked
  cloudProvisionStatus?: CloudProvisionStatus;
}

// ── SSE event shapes from BridgeBot /v1/chat ─────────────────────────────────

export interface SSEDelta  { type: 'delta'; text: string }
export interface SSEDone   { type: 'done' }
export interface SSEError  { type: 'error'; message: string }
export type SSEEvent = SSEDelta | SSEDone | SSEError;

// ── Proxy request/response shapes ────────────────────────────────────────────

export interface ProxyRequest {
  profileId: string;
  message: string;
  conversationId: string;
}

export interface VerifyRequest {
  profileId: string;
}

export interface VerifyResponse {
  ok: boolean;
  status: HealthStatus;
  detail?: string;
}

// ── Server store interface ────────────────────────────────────────────────────

export interface ServerStore {
  profiles: ServerProfile[];
  activeProfileId: string | null;

  activeProfile: () => ServerProfile | null;
  addProfile: (profile: Omit<ServerProfile, 'id' | 'lastHealthStatus' | 'lastCheckedAt'>) => string;
  updateProfile: (id: string, patch: Partial<ServerProfile>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  setDefault: (id: string) => void;
  recordHealthCheck: (id: string, status: HealthStatus) => void;
}
```

---

## Section B — Developer A: BridgeBot Backend

**Working directory:** `/Users/openclaw/Desktop/Jefe/Projects/bridgebot/`

### Overview

Add a `/v1/` API prefix to each bridgebot runner. Each bot instance (claude/gemini/codex/qwen/free) has its own `.env` file. Add `BRIDGE_CLOUD_API_KEY` to each. Wire up two new routes in `server.py`: `GET /v1/health` (public) and `POST /v1/chat` (auth-gated SSE).

### 1. Add `BRIDGE_CLOUD_API_KEY` to config.py

In `/Users/openclaw/Desktop/Jefe/Projects/bridgebot/config.py`, after the `INTERNAL_API_KEY` line (line 120), add:

```python
# API key for Bridge Cloud web UI. Format: bc_live_<hex32>
# Example: bc_live_a3f9c2d1e8b7...
BRIDGE_CLOUD_API_KEY: str = os.environ.get("BRIDGE_CLOUD_API_KEY", "")
```

Import it in `server.py` by adding `BRIDGE_CLOUD_API_KEY` to the existing import from config (line 24):

```python
from config import (
    ALLOWED_USER_ID, ALLOWED_USER_IDS, USER_NAMES, HOST, PORT, VOICE_MAX_LENGTH, WEBHOOK_URL,
    TELEGRAM_BOT_TOKEN, CLI_RUNNER, BOT_NAME, BOT_EMOJI, MEMORY_DIR,
    is_cli_available, validate_config, logger,
    COLLAB_ENABLED, INTERNAL_API_KEY, BRIDGE_CLOUD_API_KEY,
)
```

### 2. Add auth dependency

Add this helper function to `server.py` **after** the existing imports block, before the first route definition:

```python
def _require_bridge_cloud_key(x_api_key: str = Header(default="")) -> str:
    """FastAPI dependency — validates X-API-Key for /v1/* routes."""
    if not BRIDGE_CLOUD_API_KEY:
        raise HTTPException(status_code=503, detail="BRIDGE_CLOUD_API_KEY not configured on this server")
    if not x_api_key or x_api_key != BRIDGE_CLOUD_API_KEY:
        logger.warning("Rejected /v1 request — missing or invalid X-API-Key")
        raise HTTPException(status_code=401, detail="Unauthorized")
    return x_api_key
```

Add the missing FastAPI imports — `Depends` and `HTTPException` — to the existing fastapi import line:

```python
from fastapi import FastAPI, Request, Header, Depends, HTTPException
```

Also add `StreamingResponse` to the existing fastapi.responses import:

```python
from fastapi.responses import JSONResponse, StreamingResponse
```

### 3. Add `GET /v1/health`

Add immediately after the existing `@app.get("/health")` block (around line 726):

```python
@app.get("/v1/health")
async def v1_health():
    """Public health endpoint for Bridge Cloud verification.
    Returns 200 with status=ok when the server is healthy.
    No authentication required — so the connect form can ping before saving."""
    info = health.get_health()
    return {
        "status": "ok",
        "runner": CLI_RUNNER,
        "bot_name": BOT_NAME or CLI_RUNNER,
        "uptime_seconds": info.get("uptime_seconds", 0),
    }
```

### 4. Add `POST /v1/chat`

Add immediately after the `/v1/health` route:

```python
class V1ChatRequest(BaseModel):
    message: str
    conversation_id: str = ""
    agent_id: str = ""


@app.post("/v1/chat")
async def v1_chat(
    req: V1ChatRequest,
    _key: str = Depends(_require_bridge_cloud_key),
):
    """SSE streaming chat endpoint for Bridge Cloud.

    Emits newline-delimited JSON events:
        {"type":"delta","text":"..."}
        {"type":"done"}
        {"type":"error","message":"..."}
    """
    async def generate():
        try:
            # runner.run_query yields text or returns full string depending on runner.
            # We stream character-by-character from the full response.
            # If runner gains native async generator support, swap this out.
            response: str = await asyncio.wait_for(
                runner.run_query(req.message, timeout=120),
                timeout=125,
            )
            # Stream in ~80-char chunks so the client feels responsive
            chunk_size = 80
            for i in range(0, len(response), chunk_size):
                chunk = response[i : i + chunk_size]
                yield json.dumps({"type": "delta", "text": chunk}) + "\n"
                await asyncio.sleep(0)  # yield control to event loop
            yield json.dumps({"type": "done"}) + "\n"
        except asyncio.TimeoutError:
            yield json.dumps({"type": "error", "message": "Response timed out"}) + "\n"
        except Exception as exc:
            logger.error("v1_chat error: %s", exc)
            yield json.dumps({"type": "error", "message": str(exc)}) + "\n"

    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
```

### 5. Add `BRIDGE_CLOUD_API_KEY` to each bot's .env file

Each bot has its own secrets file. Add a unique key to each:

| Bot | Secrets file |
|---|---|
| Claude | `~/.jefe/secrets/.env.claude` |
| Gemini | `~/.jefe/secrets/.env.gemini` |
| Codex | `~/.jefe/secrets/.env.codex` |
| Qwen | `~/.jefe/secrets/.env.qwen` |
| Free | `~/.jefe/secrets/.env.free` |

Generate a unique key per bot with: `python3 -c "import secrets; print('bc_live_' + secrets.token_hex(16))"`

Line to add to each `.env` file:
```
BRIDGE_CLOUD_API_KEY=bc_live_<generated_hex32>
```

### 6. Restart all bot LaunchAgents after changes

```bash
for bot in claude gemini codex qwen free; do
  launchctl unload ~/Library/LaunchAgents/jefe.$bot.plist
  sleep 1
  launchctl load ~/Library/LaunchAgents/jefe.$bot.plist
done
```

### What Dev A does NOT touch
- No changes to frontend files
- No changes to `src/types/index.ts` (that is Dev B's import)
- Do not rename or remove existing `/health` or `/query` routes

---

## Section C — Developer B: Next.js Proxy + Server Store

**Working directory:** `/Users/openclaw/Desktop/Jefe/Projects/bridge-cloud/`

### 1. Create `src/store/serverStore.ts`

```typescript
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ServerStore, ServerProfile, HealthStatus } from '@/types';

function generateProfileId(): string {
  return 'sp_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useServerStore = create<ServerStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      activeProfile: () => {
        const s = get();
        return s.profiles.find(p => p.id === s.activeProfileId) ?? null;
      },

      addProfile: (profile) => {
        const id = generateProfileId();
        const newProfile: ServerProfile = {
          ...profile,
          id,
          lastHealthStatus: 'unknown',
          lastCheckedAt: null,
        };
        set(s => {
          const isFirst = s.profiles.length === 0;
          return {
            profiles: [...s.profiles, newProfile],
            activeProfileId: isFirst ? id : s.activeProfileId,
          };
        });
        return id;
      },

      updateProfile: (id, patch) =>
        set(s => ({
          profiles: s.profiles.map(p => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deleteProfile: (id) =>
        set(s => {
          const profiles = s.profiles.filter(p => p.id !== id);
          const activeProfileId =
            s.activeProfileId === id
              ? (profiles.find(p => p.isDefault)?.id ?? profiles[0]?.id ?? null)
              : s.activeProfileId;
          return { profiles, activeProfileId };
        }),

      setActiveProfile: (id) => set({ activeProfileId: id }),

      setDefault: (id) =>
        set(s => ({
          profiles: s.profiles.map(p => ({ ...p, isDefault: p.id === id })),
        })),

      recordHealthCheck: (id, status: HealthStatus) =>
        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === id
              ? { ...p, lastHealthStatus: status, lastCheckedAt: Date.now() }
              : p
          ),
        })),
    }),
    {
      name: 'bridge-cloud-servers',
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);
```

### 2. Create `src/lib/healthCheck.ts`

```typescript
import type { HealthStatus } from '@/types';

export async function checkServerHealth(profileId: string): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/proxy/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return 'offline';
    const data = await res.json();
    return (data.status as HealthStatus) ?? 'unknown';
  } catch {
    return 'offline';
  }
}

/**
 * One-shot health check using raw URL + key — used in the connection form
 * BEFORE a profile has been saved to the store.
 */
export async function checkRawServerHealth(
  url: string,
  apiKey: string
): Promise<{ ok: boolean; status: HealthStatus; detail?: string }> {
  try {
    const res = await fetch('/api/proxy/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawUrl: url, rawApiKey: apiKey }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return {
      ok: res.ok && data.status === 'healthy',
      status: data.status ?? 'unknown',
      detail: data.detail,
    };
  } catch (e) {
    return { ok: false, status: 'offline', detail: String(e) };
  }
}
```

### 3. Create `src/app/api/proxy/route.ts`

This is the streaming proxy. It reads server credentials from environment variables (never from the request body), then forwards to BridgeBot `/v1/chat`.

```typescript
import { NextRequest } from 'next/server';
import type { ProxyRequest } from '@/types';

// Build env-var lookup: profileId → { url, apiKey }
// Env var names: BRIDGEBOT_CLAUDE_URL / BRIDGEBOT_CLAUDE_KEY, etc.
function getServerCredentials(profileId: string): { url: string; apiKey: string } | null {
  // profileId matches agentId convention: "claude" | "gemini" | "codex" | "qwen" | "free"
  const key = profileId.toUpperCase().replace(/-/g, '_');
  const url = process.env[`BRIDGEBOT_${key}_URL`];
  const apiKey = process.env[`BRIDGEBOT_${key}_KEY`];
  if (!url || !apiKey) return null;
  return { url, apiKey };
}

export async function POST(req: NextRequest) {
  let body: ProxyRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { profileId, message, conversationId } = body;
  if (!profileId || !message) {
    return Response.json({ error: 'profileId and message are required' }, { status: 400 });
  }

  const creds = getServerCredentials(profileId);
  if (!creds) {
    return Response.json(
      { error: `No server credentials configured for profileId: ${profileId}` },
      { status: 503 }
    );
  }

  const upstreamUrl = `${creds.url.replace(/\/$/, '')}/v1/chat`;

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': creds.apiKey,
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId ?? '',
        agent_id: profileId,
      }),
      // @ts-expect-error — Next.js fetch does not timeout by default in Route Handlers
      signal: AbortSignal.timeout(130_000),
    });
  } catch (e) {
    return Response.json({ error: `Upstream unreachable: ${e}` }, { status: 502 });
  }

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => '');
    return Response.json(
      { error: `Upstream error ${upstreamRes.status}`, detail: text },
      { status: upstreamRes.status }
    );
  }

  // Pass the upstream NDJSON stream straight through to the browser
  return new Response(upstreamRes.body, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
```

### 4. Create `src/app/api/proxy/verify/route.ts`

```typescript
import { NextRequest } from 'next/server';
import type { VerifyResponse } from '@/types';

function getServerCredentials(profileId: string): { url: string; apiKey: string } | null {
  const key = profileId.toUpperCase().replace(/-/g, '_');
  const url = process.env[`BRIDGEBOT_${key}_URL`];
  const apiKey = process.env[`BRIDGEBOT_${key}_KEY`];
  if (!url || !apiKey) return null;
  return { url, apiKey };
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: { profileId?: string; rawUrl?: string; rawApiKey?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, status: 'unknown', detail: 'Invalid JSON' } satisfies VerifyResponse, { status: 400 });
  }

  let url: string;
  let apiKey: string;

  if (body.rawUrl && body.rawApiKey) {
    // Pre-save check from connection form
    url = body.rawUrl;
    apiKey = body.rawApiKey;
  } else if (body.profileId) {
    const creds = getServerCredentials(body.profileId);
    if (!creds) {
      return Response.json(
        { ok: false, status: 'unknown', detail: 'No credentials configured' } satisfies VerifyResponse,
        { status: 503 }
      );
    }
    url = creds.url;
    apiKey = creds.apiKey;
  } else {
    return Response.json(
      { ok: false, status: 'unknown', detail: 'Provide profileId or rawUrl+rawApiKey' } satisfies VerifyResponse,
      { status: 400 }
    );
  }

  const healthUrl = `${url.replace(/\/$/, '')}/v1/health`;

  try {
    const res = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      return Response.json({ ok: true, status: 'healthy' } satisfies VerifyResponse);
    }

    if (res.status === 401) {
      return Response.json(
        { ok: false, status: 'degraded', detail: 'Invalid API key' } satisfies VerifyResponse
      );
    }

    return Response.json(
      { ok: false, status: 'degraded', detail: `HTTP ${res.status}` } satisfies VerifyResponse
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg.includes('CORS') || msg.includes('fetch') ? 'offline' : 'offline';
    return Response.json(
      { ok: false, status, detail: msg } satisfies VerifyResponse
    );
  }
}
```

**Note on CORS:** The verify route runs server-side, so CORS is not a factor. The browser hits `/api/proxy/verify` (same origin), which hits BridgeBot server-to-server. This architecture intentionally avoids exposing bot URLs to the browser.

### 5. Update `src/lib/streaming.ts`

Replace the entire file content:

```typescript
import type { SSEEvent } from '@/types';

/**
 * Stream a message through the Next.js proxy route.
 * Reads newline-delimited JSON (NDJSON) from /api/proxy and calls
 * onChunk for each text delta until done or error.
 */
export async function streamFromEndpoint(
  profileId: string,
  payload: { message: string; agentId: string; conversationId: string },
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profileId,
      message: payload.message,
      conversationId: payload.conversationId,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '');
    throw new Error(`Proxy error ${res.status}: ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const event = JSON.parse(trimmed) as SSEEvent;
        if (event.type === 'delta') {
          onChunk(event.text);
        } else if (event.type === 'error') {
          throw new Error(event.message);
        }
        // type === 'done' → fall through, outer loop will also end
      } catch (parseErr) {
        // Malformed line — skip silently unless it was a re-thrown error
        if (parseErr instanceof SyntaxError) continue;
        throw parseErr;
      }
    }
  }
}
```

### 6. Update `src/store/chatStore.ts` — wire real streaming

In `chatStore.ts`, change the `sendMessage` method to call `streamFromEndpoint` instead of `streamMockResponse`. The function signature of `streamFromEndpoint` has changed (first arg is now `profileId`, not `endpoint`).

Replace:
```typescript
import { streamMockResponse } from '@/lib/mockApi';
```
With:
```typescript
import { streamFromEndpoint } from '@/lib/streaming';
import { useServerStore } from '@/store/serverStore';
```

Replace the `streamMockResponse` call block (lines 83–96 in current chatStore.ts):
```typescript
        const agentId = get().activeAgentId;
        await streamMockResponse(content, agentId, (chunk) => {
```
With:
```typescript
        const agentId = get().activeAgentId;
        const activeProfile = useServerStore.getState().activeProfile();
        const profileId = activeProfile?.id ?? agentId;

        // Fall back to mock if no server profile is configured
        if (!activeProfile) {
          const { streamMockResponse } = await import('@/lib/mockApi');
          await streamMockResponse(content, agentId, (chunk) => {
            set(s => ({
              conversations: s.conversations.map(c =>
                c.id === convId
                  ? { ...c, messages: c.messages.map(m => m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m) }
                  : c
              ),
            }));
          });
        } else {
          await streamFromEndpoint(profileId, { message: content, agentId, conversationId: convId! }, (chunk) => {
```
And close the else block after the existing `}));` that ends the chunk handler, then replace the existing outer `});` close.

**Exact replacement** — replace the entire sendMessage implementation from `const agentId = get().activeAgentId;` through the end of the `await streamMockResponse(...)` call and its closing `});`:

```typescript
        const agentId = get().activeAgentId;
        const activeProfile = useServerStore.getState().activeProfile();

        const applyChunk = (chunk: string) => {
          set(s => ({
            conversations: s.conversations.map(c =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map(m =>
                      m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
                    ),
                  }
                : c
            ),
          }));
        };

        if (!activeProfile) {
          const { streamMockResponse } = await import('@/lib/mockApi');
          await streamMockResponse(content, agentId, applyChunk);
        } else {
          await streamFromEndpoint(
            activeProfile.id,
            { message: content, agentId, conversationId: convId! },
            applyChunk
          );
        }
```

### 7. Add `.env.local`

Create `/Users/openclaw/Desktop/Jefe/Projects/bridge-cloud/.env.local`:

```bash
# BridgeBot server credentials — never exposed to the browser
# URL = base URL of each bot (no trailing slash)
# KEY = BRIDGE_CLOUD_API_KEY value from that bot's .env file

BRIDGEBOT_CLAUDE_URL=http://localhost:8585
BRIDGEBOT_CLAUDE_KEY=bc_live_REPLACE_WITH_CLAUDE_KEY

BRIDGEBOT_GEMINI_URL=http://localhost:8586
BRIDGEBOT_GEMINI_KEY=bc_live_REPLACE_WITH_GEMINI_KEY

BRIDGEBOT_CODEX_URL=http://localhost:8587
BRIDGEBOT_CODEX_KEY=bc_live_REPLACE_WITH_CODEX_KEY

BRIDGEBOT_QWEN_URL=http://localhost:8588
BRIDGEBOT_QWEN_KEY=bc_live_REPLACE_WITH_QWEN_KEY

BRIDGEBOT_FREE_URL=http://localhost:8590
BRIDGEBOT_FREE_KEY=bc_live_REPLACE_WITH_FREE_KEY
```

Replace the `REPLACE_WITH_*_KEY` placeholders with the actual keys generated by Dev A.

### What Dev B does NOT touch
- `src/types/index.ts` — only READS the types Dev A+B added
- `src/lib/agents.ts` — not modified
- Any component files — that is Dev C
- `src/app/api/chat/route.ts` — leave existing mock route in place

---

## Section D — Developer C: Frontend UI

**Working directory:** `/Users/openclaw/Desktop/Jefe/Projects/bridge-cloud/`

All new components live under `src/components/server/`. Do not touch `src/components/agent/`, `src/components/chat/`, or `src/components/input/`.

### Color / style conventions

Existing design tokens used throughout:
- Background: `#0a1410` (page), `#0e1c14` (sidebar), `#1a2e20` (cards)
- Border: `#1e3025`
- Text primary: `#ececec`, secondary: `#8e8e8e`
- Accent green: `#6c8cff` (focus rings), `#4ade80` (healthy dot)
- Amber: `#fbbf24` (degraded), Red: `#f87171` (offline)
- Button hover: `bg-[#1e3025]`

All new components must use these tokens. Do not introduce new color values.

---

### Component 1: `src/components/server/ServerStatusDot.tsx`

Small inline dot with optional label. Used in Sidebar.

```tsx
'use client';
import { cn } from '@/lib/cn';
import type { HealthStatus } from '@/types';

const STATUS_COLORS: Record<HealthStatus, string> = {
  healthy: 'bg-[#4ade80]',
  degraded: 'bg-[#fbbf24]',
  offline:  'bg-[#f87171]',
  unknown:  'bg-[#8e8e8e]',
};

interface Props {
  status: HealthStatus;
  label?: string;
  className?: string;
}

export default function ServerStatusDot({ status, label, className }: Props) {
  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn('w-2 h-2 rounded-full flex-shrink-0', STATUS_COLORS[status])}
        title={status}
      />
      {label && (
        <span className="text-[13px] text-[#8e8e8e] truncate">{label}</span>
      )}
    </span>
  );
}
```

---

### Component 2: `src/components/server/ServerSwitcher.tsx`

Popover that shows all profiles. Click the dot/name in the sidebar to open.

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Settings } from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { checkServerHealth } from '@/lib/healthCheck';
import ServerStatusDot from './ServerStatusDot';

interface Props {
  onOpenManager: () => void;
}

export default function ServerSwitcher({ onOpenManager }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const profiles = useServerStore(s => s.profiles);
  const activeProfileId = useServerStore(s => s.activeProfileId);
  const setActiveProfile = useServerStore(s => s.setActiveProfile);
  const recordHealthCheck = useServerStore(s => s.recordHealthCheck);
  const activeProfile = useServerStore(s => s.activeProfile)();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefreshHealth = async (profileId: string) => {
    const status = await checkServerHealth(profileId);
    recordHealthCheck(profileId, status);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1.5 w-full rounded-md hover:bg-[#1e3025] transition-colors"
        title="Switch server"
      >
        <ServerStatusDot
          status={activeProfile?.lastHealthStatus ?? 'unknown'}
          label={activeProfile?.name ?? 'No server'}
        />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-0 bottom-full mb-1 w-[240px] bg-[#0e1c14] border border-[#1e3025] rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-[#1e3025]">
            <span className="text-[11px] uppercase tracking-widest text-[#8e8e8e]">Servers</span>
          </div>
          <ul className="py-1 max-h-[280px] overflow-y-auto">
            {profiles.map(profile => (
              <li key={profile.id}>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#1a2e20] transition-colors text-left"
                  onClick={() => { setActiveProfile(profile.id); setOpen(false); }}
                >
                  <ServerStatusDot status={profile.lastHealthStatus} />
                  <span className="flex-1 text-[13px] text-[#ececec] truncate">{profile.name}</span>
                  {profile.id === activeProfileId && (
                    <CheckCircle2 size={14} className="text-[#4ade80] flex-shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#1e3025] px-3 py-2 flex gap-2">
            <button
              onClick={() => { setOpen(false); onOpenManager(); }}
              className="flex items-center gap-1.5 text-[12px] text-[#8e8e8e] hover:text-[#ececec] transition-colors"
            >
              <Settings size={13} />
              Manage servers
            </button>
            {activeProfile && (
              <button
                onClick={() => handleRefreshHealth(activeProfile.id)}
                className="ml-auto text-[12px] text-[#8e8e8e] hover:text-[#ececec] transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Component 3: `src/components/server/ConnectForm.tsx`

Used both in ServerGate (first-run) and ServerManager (add new). Calls `checkRawServerHealth` before saving.

```tsx
'use client';
import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { checkRawServerHealth } from '@/lib/healthCheck';
import { AGENTS } from '@/lib/agents';

interface Props {
  onSaved?: (profileId: string) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail';

export default function ConnectForm({ onSaved, onCancel, showCancel = false }: Props) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [agentId, setAgentId] = useState(AGENTS[0].id);
  const [testState, setTestState] = useState<TestState>('idle');
  const [testDetail, setTestDetail] = useState('');
  const addProfile = useServerStore(s => s.addProfile);

  const handleTest = async () => {
    if (!url || !apiKey) return;
    setTestState('testing');
    setTestDetail('');
    const result = await checkRawServerHealth(url.trim(), apiKey.trim());
    if (result.ok) {
      setTestState('ok');
      setTestDetail('');
    } else {
      setTestState('fail');
      setTestDetail(result.detail ?? result.status);
    }
  };

  const handleSave = () => {
    if (!url || !apiKey || !name) return;
    const id = addProfile({
      name: name.trim(),
      agentId,
      url: url.trim().replace(/\/$/, ''),
      apiKey: apiKey.trim(),
      isDefault: false,
    });
    onSaved?.(id);
  };

  const inputClass =
    'w-full bg-[#0a1410] border border-[#1e3025] rounded-md px-3 py-2 text-[14px] text-[#ececec] placeholder:text-[#8e8e8e] focus:outline-none focus:ring-2 focus:ring-[#6c8cff] transition';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-[12px] text-[#8e8e8e] uppercase tracking-wider">Server URL</label>
        <input
          className={inputClass}
          type="url"
          placeholder="https://your-bot-host:8585"
          value={url}
          onChange={e => { setUrl(e.target.value); setTestState('idle'); }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] text-[#8e8e8e] uppercase tracking-wider">API Key</label>
        <input
          className={inputClass}
          type="password"
          placeholder="bc_live_..."
          value={apiKey}
          onChange={e => { setApiKey(e.target.value); setTestState('idle'); }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] text-[#8e8e8e] uppercase tracking-wider">Agent</label>
        <select
          className={inputClass}
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
        >
          {AGENTS.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] text-[#8e8e8e] uppercase tracking-wider">Display name</label>
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. Jefe's Claude"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* Test connection feedback */}
      {testState === 'ok' && (
        <div className="flex items-center gap-2 text-[#4ade80] text-[13px]">
          <CheckCircle2 size={15} /> Connection successful
        </div>
      )}
      {testState === 'fail' && (
        <div className="flex items-start gap-2 text-[#f87171] text-[13px]">
          <XCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>Connection failed{testDetail ? `: ${testDetail}` : ''}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleTest}
          disabled={!url || !apiKey || testState === 'testing'}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#1e3025] text-[13px] text-[#ececec] hover:bg-[#1e3025] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {testState === 'testing' ? <Loader2 size={14} className="animate-spin" /> : null}
          Test connection
        </button>

        {showCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-[13px] text-[#8e8e8e] hover:text-[#ececec] transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={!url || !apiKey || !name || testState !== 'ok'}
          className="ml-auto px-4 py-2 rounded-md bg-[#1e3025] text-[13px] text-[#ececec] hover:bg-[#2a4030] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Save server
        </button>
      </div>
    </div>
  );
}
```

---

### Component 4: `src/components/server/ServerGate.tsx`

Full-screen gate shown when `profiles.length === 0`. Replaces main content area — NOT a modal.

```tsx
'use client';
import { Server } from 'lucide-react';
import ConnectForm from './ConnectForm';
import { useServerStore } from '@/store/serverStore';

export default function ServerGate() {
  const setActiveProfile = useServerStore(s => s.setActiveProfile);

  const handleSaved = (profileId: string) => {
    setActiveProfile(profileId);
    // Gate disappears automatically because profiles.length > 0 in AppShell guard
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1410] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1a2e20] border border-[#1e3025] flex items-center justify-center">
            <Server size={24} className="text-[#4ade80]" />
          </div>
          <h1 className="text-[22px] font-semibold text-[#ececec] tracking-tight">
            Connect a server
          </h1>
          <p className="text-[14px] text-[#8e8e8e] text-center max-w-xs">
            Enter your BridgeBot server URL and API key to get started.
          </p>
        </div>
        <div className="bg-[#0e1c14] border border-[#1e3025] rounded-xl p-6">
          <ConnectForm onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
}
```

---

### Component 5: `src/components/server/ServerManager.tsx`

Panel (slide-in drawer or full-page) for CRUD on server profiles. Triggered from ServerSwitcher.

```tsx
'use client';
import { useState } from 'react';
import { Trash2, Plus, X, Star } from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { checkServerHealth } from '@/lib/healthCheck';
import ServerStatusDot from './ServerStatusDot';
import ConnectForm from './ConnectForm';

interface Props {
  onClose: () => void;
}

export default function ServerManager({ onClose }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const profiles = useServerStore(s => s.profiles);
  const deleteProfile = useServerStore(s => s.deleteProfile);
  const setDefault = useServerStore(s => s.setDefault);
  const recordHealthCheck = useServerStore(s => s.recordHealthCheck);

  const handleDelete = (id: string) => {
    if (confirm('Remove this server profile?')) deleteProfile(id);
  };

  const handleRefresh = async (id: string) => {
    const status = await checkServerHealth(id);
    recordHealthCheck(id, status);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-lg bg-[#0e1c14] border border-[#1e3025] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3025]">
          <h2 className="text-[16px] font-semibold text-[#ececec]">Manage servers</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#8e8e8e] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile list */}
        <ul className="divide-y divide-[#1e3025] max-h-[300px] overflow-y-auto">
          {profiles.length === 0 && (
            <li className="px-5 py-4 text-[13px] text-[#8e8e8e]">No servers added yet.</li>
          )}
          {profiles.map(profile => (
            <li key={profile.id} className="flex items-center gap-3 px-5 py-3">
              <ServerStatusDot status={profile.lastHealthStatus} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#ececec] truncate">{profile.name}</span>
                  {profile.isDefault && (
                    <span className="text-[10px] text-[#fbbf24] bg-[#fbbf24]/10 px-1.5 py-0.5 rounded">default</span>
                  )}
                </div>
                <span className="text-[12px] text-[#8e8e8e] truncate block">{profile.url}</span>
              </div>
              <button
                onClick={() => handleRefresh(profile.id)}
                className="text-[12px] text-[#8e8e8e] hover:text-[#ececec] transition-colors"
                title="Check health"
              >
                Ping
              </button>
              <button
                onClick={() => setDefault(profile.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#8e8e8e] hover:text-[#fbbf24] hover:bg-[#1e3025] transition-colors"
                title="Set as default"
              >
                <Star size={14} />
              </button>
              <button
                onClick={() => handleDelete(profile.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#8e8e8e] hover:text-[#f87171] hover:bg-[#1e3025] transition-colors"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>

        {/* Add server section */}
        <div className="border-t border-[#1e3025] px-5 py-4">
          {showAdd ? (
            <ConnectForm
              onSaved={() => setShowAdd(false)}
              onCancel={() => setShowAdd(false)}
              showCancel
            />
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-[13px] text-[#8e8e8e] hover:text-[#ececec] transition-colors"
            >
              <Plus size={15} /> Add server
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Update `src/components/layout/AppShell.tsx`

Add the ServerGate guard. When `profiles.length === 0`, render `ServerGate` instead of the normal layout.

```tsx
'use client';
import { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useServerStore } from '@/store/serverStore';
import Sidebar from './Sidebar';
import Header from './Header';
import ServerGate from '@/components/server/ServerGate';
import ServerManager from '@/components/server/ServerManager';
import { cn } from '@/lib/cn';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useChatStore(s => s.isSidebarOpen);
  const setSidebarOpen = useChatStore(s => s.setSidebarOpen);
  const profiles = useServerStore(s => s.profiles);
  const [managerOpen, setManagerOpen] = useState(false);

  // Gate: no servers configured yet
  if (profiles.length === 0) {
    return <ServerGate />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a1410]">
      {/* Mobile backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-[240ms]',
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 w-[260px] flex-shrink-0 flex flex-col',
          'bg-[#0e1c14] border-r border-[#1e3025] z-50 h-full',
          'transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          '-translate-x-full lg:translate-x-0',
          isSidebarOpen && 'translate-x-0'
        )}
      >
        <Sidebar onOpenServerManager={() => setManagerOpen(true)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Server manager modal */}
      {managerOpen && <ServerManager onClose={() => setManagerOpen(false)} />}
    </div>
  );
}
```

---

### Update `src/components/layout/Sidebar.tsx`

Add `onOpenServerManager` prop. Add `ServerSwitcher` at the bottom of the sidebar above the conversation list.

```tsx
'use client';
import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import AgentSelector from '@/components/agent/AgentSelector';
import ConversationList from '@/components/chat/ConversationList';
import ServerSwitcher from '@/components/server/ServerSwitcher';

interface Props {
  onOpenServerManager: () => void;
}

export default function Sidebar({ onOpenServerManager }: Props) {
  const router = useRouter();
  const newConversation = useChatStore(s => s.newConversation);
  const setSidebarOpen = useChatStore(s => s.setSidebarOpen);
  const activeAgentId = useChatStore(s => s.activeAgentId);
  const setActiveAgent = useChatStore(s => s.setActiveAgent);

  const handleNewChat = () => {
    const id = newConversation();
    router.push('/chat/' + id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 flex-shrink-0">
        <span className="text-[#ececec] font-semibold text-[15px] tracking-tight">Bridge Cloud</span>
        <button
          onClick={handleNewChat}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#8e8e8e] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
          title="New chat"
        >
          <SquarePen size={16} />
        </button>
      </div>

      {/* Server switcher */}
      <div className="px-2 pb-2 flex-shrink-0">
        <ServerSwitcher onOpenManager={onOpenServerManager} />
      </div>

      {/* Agent selector */}
      <div className="px-2 pb-3 flex-shrink-0">
        <AgentSelector activeAgentId={activeAgentId} onSelect={setActiveAgent} />
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-[#1e3025] mb-2 flex-shrink-0" />

      {/* Conversation list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ConversationList />
      </div>
    </div>
  );
}
```

### What Dev C does NOT touch
- `src/store/chatStore.ts` — that is Dev B
- `src/lib/streaming.ts` — that is Dev B
- `src/app/api/` — that is Dev B
- `src/types/index.ts` — only READS the new types
- `src/lib/agents.ts` — not modified

---

## Section E — Shared Rules for All Three Developers

### Type import convention

All types come from `@/types` (barrel export from `src/types/index.ts`). Never import types from component files or store files.

### Naming rules (binding, no exceptions)

| Item | Name |
|---|---|
| Server profile type | `ServerProfile` |
| Server store hook | `useServerStore` |
| Health status type | `HealthStatus` |
| SSE event types | `SSEDelta`, `SSEDone`, `SSEError`, `SSEEvent` |
| Proxy request type | `ProxyRequest` |
| BridgeBot env prefix | `BRIDGEBOT_{AGENT}_URL` / `BRIDGEBOT_{AGENT}_KEY` |
| BridgeBot API key env | `BRIDGE_CLOUD_API_KEY` (in each bot's `.env`) |
| BridgeBot API key header | `X-API-Key` |
| BridgeBot chat endpoint | `POST /v1/chat` |
| BridgeBot health endpoint | `GET /v1/health` |
| Next.js proxy route | `POST /api/proxy` |
| Next.js verify route | `POST /api/proxy/verify` |

### No-conflict rules

1. `chatStore.ts` has a `persist` key `bridge-cloud-chat`. The new server store uses `bridge-cloud-servers`. These must never collide.
2. The existing `Agent.endpoint` field in `src/lib/agents.ts` is NOT the same as `ServerProfile.url`. `Agent.endpoint` is a localhost dev reference; `ServerProfile.url` is the cloud-accessible URL stored by the user. Do not confuse or merge these.
3. Dev B's `streamFromEndpoint` replaces the stub in `src/lib/streaming.ts` but the function signature is intentionally different from the original stub. The chatStore must call the new signature (see Dev B's section for exact call site).
4. `src/app/api/chat/route.ts` is left untouched. It uses `streamMockResponse` directly and serves as a fallback. Do not rename or remove it.
5. Dev C's `AppShell.tsx` replacement passes an `onOpenServerManager` prop to `Sidebar`. The `Sidebar` component must accept this prop or TypeScript will error. Dev C owns both files — update them together.
6. The `useServerStore.getState()` call in `chatStore.ts` (Dev B's change) is a Zustand pattern for reading another store from outside React. This is correct and intentional — do not refactor it to a hook call.
7. All three developers must run `npm run build` (or `npx tsc --noEmit`) before considering their work done. Type errors in any file are a blocker for all three.

### Implementation order

Devs can work in parallel except for these dependencies:

```
Dev A (backend) ──────────────────────────────── independent
Dev B (proxy/store) ────────────────────────── requires types from Section A first
Dev C (UI) ─────────────────── requires useServerStore (Dev B) and types (Section A)
```

The types in Section A are a shared prerequisite. Whoever touches `src/types/index.ts` first (most naturally Dev B) should commit the type additions before Dev C's components can compile.

---

## Appendix: File change summary

### New files (none exist yet)

| Path | Owner |
|---|---|
| `src/store/serverStore.ts` | Dev B |
| `src/lib/healthCheck.ts` | Dev B |
| `src/app/api/proxy/route.ts` | Dev B |
| `src/app/api/proxy/verify/route.ts` | Dev B |
| `.env.local` | Dev B |
| `src/components/server/ServerStatusDot.tsx` | Dev C |
| `src/components/server/ServerSwitcher.tsx` | Dev C |
| `src/components/server/ConnectForm.tsx` | Dev C |
| `src/components/server/ServerGate.tsx` | Dev C |
| `src/components/server/ServerManager.tsx` | Dev C |

### Modified files

| Path | Owner | Change |
|---|---|---|
| `src/types/index.ts` | Dev B | Append `ServerProfile` and SSE types (Section A) |
| `src/lib/streaming.ts` | Dev B | Full replacement — real NDJSON reader |
| `src/store/chatStore.ts` | Dev B | Replace `streamMockResponse` call with `streamFromEndpoint` + fallback |
| `src/components/layout/AppShell.tsx` | Dev C | Add gate guard + manager modal |
| `src/components/layout/Sidebar.tsx` | Dev C | Add `onOpenServerManager` prop + `ServerSwitcher` |
| `/Users/openclaw/Desktop/Jefe/Projects/bridgebot/config.py` | Dev A | Add `BRIDGE_CLOUD_API_KEY` |
| `/Users/openclaw/Desktop/Jefe/Projects/bridgebot/server.py` | Dev A | Add imports + auth dep + `/v1/health` + `/v1/chat` |
| `~/.jefe/secrets/.env.{claude,gemini,codex,qwen,free}` | Dev A | Add `BRIDGE_CLOUD_API_KEY=bc_live_...` to each |
