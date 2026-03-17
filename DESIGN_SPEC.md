# Bridge Cloud — Design Spec

Version 1.0 | Dark-mode-first chat UI

---

## Overview

Bridge Cloud is a minimalist, dark-mode-first AI chat interface. The aesthetic is ChatGPT dark but slightly more refined: cooler background tones, sharper typography, a more intentional accent color, and cleaner spatial rhythm. No gradients, no drop shadows except on the input bar, no rounded "bubble" chat layout — messages are flat and full-width like ChatGPT or Claude.ai.

Stack: Next.js 14+ (currently 16), Tailwind CSS v4, shadcn/ui components added as needed.

---

## 1. Color Palette

### Dark Mode (Primary — always rendered)

| Token | Hex | Usage |
|---|---|---|
| `surface-base` | `#0d0d0d` | App root background |
| `surface-sidebar` | `#111111` | Sidebar background |
| `surface-sidebar-hover` | `#1a1a1a` | Sidebar item hover |
| `surface-sidebar-active` | `#212121` | Active/selected conversation |
| `surface-chat` | `#0d0d0d` | Chat panel background (same as root) |
| `surface-input` | `#1a1a1a` | Input bar background |
| `surface-input-focus` | `#1f1f1f` | Input focused state |
| `surface-dropdown` | `#181818` | Dropdown/popover background |
| `surface-dropdown-hover` | `#222222` | Dropdown item hover |
| `border-subtle` | `#2a2a2a` | Sidebar dividers, input border |
| `border-strong` | `#3a3a3a` | Focused input ring, modal borders |
| `text-primary` | `#ececec` | Main body text, user messages |
| `text-secondary` | `#9b9b9b` | Timestamps, sidebar meta, placeholders |
| `text-muted` | `#5c5c5c` | Disabled states, very secondary labels |
| `text-inverse` | `#0d0d0d` | Text on accent buttons |
| `accent` | `#6c8cff` | Send button, active indicators, links |
| `accent-hover` | `#5a7aee` | Send button hover |
| `accent-subtle` | `#1e2a4a` | Accent backgrounds (agent tag badges) |
| `bot-label` | `#7dd3a8` | Bot/AI name label in chat |
| `user-label` | `#9b9b9b` | "You" label in chat |
| `destructive` | `#e05c5c` | Delete conversation, error states |

### Light Mode (Future — not MVP)

Not implemented in v1. Tailwind's `dark:` prefix is used on every color-bearing class so light mode can be layered in later.

### CSS Custom Properties (globals.css additions)

```css
@layer base {
  :root {
    --surface-base: #0d0d0d;
    --surface-sidebar: #111111;
    --surface-input: #1a1a1a;
    --border-subtle: #2a2a2a;
    --border-strong: #3a3a3a;
    --text-primary: #ececec;
    --text-secondary: #9b9b9b;
    --text-muted: #5c5c5c;
    --accent: #6c8cff;
    --accent-hover: #5a7aee;
    --accent-subtle: #1e2a4a;
    --bot-label: #7dd3a8;
    --destructive: #e05c5c;
  }
}
```

---

## 2. Typography

### Font Family

Primary: **Inter** (Google Fonts or local). Fallback chain: `Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`.
Mono (code blocks): `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`.

No Geist fonts — the default Next.js scaffolding uses Geist but Inter is more legible at chat reading sizes.

### Type Scale

| Role | Size | Weight | Line Height | Tailwind |
|---|---|---|---|---|
| App title / header | 16px | 600 | 24px | `text-base font-semibold` |
| Sidebar item label | 14px | 400 | 20px | `text-sm font-normal` |
| Sidebar item label (active) | 14px | 500 | 20px | `text-sm font-medium` |
| Chat message body | 15px | 400 | 26px | `text-[15px] leading-[1.75]` |
| Code block | 13px | 400 | 22px | `text-[13px] font-mono leading-[1.7]` |
| Input placeholder | 14px | 400 | 20px | `text-sm` |
| Agent selector label | 13px | 500 | 18px | `text-[13px] font-medium` |
| Timestamp / meta | 12px | 400 | 16px | `text-xs text-[#9b9b9b]` |
| New Chat button | 13px | 500 | 18px | `text-[13px] font-medium` |
| Section divider label | 11px | 600 | 16px | `text-[11px] font-semibold uppercase tracking-wider` |

### Key Principle

Message text is `text-[15px] leading-[1.75]` — slightly larger than Tailwind's `text-sm` (14px) and with generous line height. This is the reading backbone of the app; don't compromise it.

---

## 3. Spacing System

Bridge Cloud uses an **8px base unit** with a few half-steps at 4px.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon-to-label gap, badge padding |
| `space-2` | 8px | Tight internal padding |
| `space-3` | 12px | Sidebar item vertical padding |
| `space-4` | 16px | Standard horizontal padding |
| `space-5` | 20px | Message vertical gap |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Large section separation |

### Border Radius

| Component | Radius | Tailwind |
|---|---|---|
| Input bar | 12px | `rounded-xl` |
| Send button | 8px | `rounded-lg` |
| Sidebar items | 6px | `rounded-md` |
| Dropdown items | 6px | `rounded-md` |
| Dropdown panel | 8px | `rounded-lg` |
| Agent badge/tag | 4px | `rounded` |
| Avatar (bot icon) | full circle | `rounded-full` |
| Code blocks | 8px | `rounded-lg` |

---

## 4. Layout

### Overall Structure

```
┌──────────────────────────────────────────────────┐
│  Sidebar (260px fixed)  │  Chat Panel (flex-1)   │
│                         │  ┌──────────────────┐  │
│  [New Chat]             │  │  Chat Header     │  │
│  ─────────────────────  │  ├──────────────────┤  │
│  [Conversation list]    │  │  Message Feed    │  │
│                         │  │  (scrollable)    │  │
│                         │  ├──────────────────┤  │
│                         │  │  Input Bar       │  │
└─────────────────────────┴──┴──────────────────┴──┘
```

- **Sidebar**: `w-[260px] flex-shrink-0`
- **Chat panel**: `flex-1 flex flex-col min-w-0`
- **Message feed**: `flex-1 overflow-y-auto`
- **Max content width** in chat: `max-w-[720px] mx-auto w-full` — centers content on wide screens, same as ChatGPT

---

## 5. Component Specs

### 5.1 Sidebar

**Container**
```
bg-[#111111] w-[260px] flex flex-col h-full border-r border-[#2a2a2a]
```

**Top section (New Chat + title)**
```
px-3 pt-4 pb-3
```

**Conversation list**
```
flex-1 overflow-y-auto px-2 py-1 space-y-0.5
```
- Scrollbar: custom thin scrollbar, `#2a2a2a` track, `#3a3a3a` thumb

**Conversation item (default)**
```
flex items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer
text-sm text-[#ececec] truncate
hover:bg-[#1a1a1a] transition-colors duration-150
```

**Conversation item (active/selected)**
```
bg-[#212121] text-[#ececec]
```

**Conversation item (on hover — show action icons)**
- Delete icon: appears on `group-hover`, `text-[#5c5c5c] hover:text-[#e05c5c]`

**Section divider label** (e.g., "Today", "Yesterday")
```
px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5c5c5c]
```

**Bottom section** (user account / settings)
```
border-t border-[#2a2a2a] px-3 py-3
flex items-center gap-2.5
text-sm text-[#9b9b9b] hover:text-[#ececec] hover:bg-[#1a1a1a]
rounded-md px-2 py-2 cursor-pointer transition-colors
```

**Sidebar full Tailwind class set:**
```tsx
// Sidebar container
<aside className="w-[260px] flex-shrink-0 flex flex-col h-full bg-[#111111] border-r border-[#2a2a2a]">

// Conversation item
<div className="group flex items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer text-sm text-[#ececec] truncate hover:bg-[#1a1a1a] transition-colors duration-150">

// Active conversation item
<div className="group flex items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer text-sm text-[#ececec] truncate bg-[#212121]">

// Section label
<p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5c5c5c] select-none">
```

---

### 5.2 New Chat Button

A full-width button at the top of the sidebar. Icon + label. No fill background by default — icon button variant with a border.

**Default state:**
```
w-full flex items-center gap-2 px-3 py-2 rounded-md
text-[13px] font-medium text-[#ececec]
border border-[#2a2a2a]
hover:bg-[#1a1a1a] hover:border-[#3a3a3a]
transition-colors duration-150 cursor-pointer
```

**Full Tailwind:**
```tsx
<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-[#ececec] border border-[#2a2a2a] hover:bg-[#1a1a1a] hover:border-[#3a3a3a] transition-colors duration-150">
  <PenSquare className="w-4 h-4 text-[#9b9b9b]" />
  New Chat
</button>
```

---

### 5.3 Chat Header

Minimal bar at top of chat panel showing current agent and conversation title.

```
h-14 flex items-center px-4 border-b border-[#2a2a2a] bg-[#0d0d0d]
justify-between
```

Left: Agent selector dropdown (see 5.5)
Right: Optional actions (share, settings icon) — `text-[#5c5c5c] hover:text-[#9b9b9b]`

---

### 5.4 Chat Message Feed

**Container:**
```
flex-1 overflow-y-auto py-6
```

**Message wrapper** — full width, centered content:
```
w-full max-w-[720px] mx-auto px-4 mb-6
```

**Bot message block:**
```tsx
<div className="w-full max-w-[720px] mx-auto px-4 mb-6">
  <div className="flex items-start gap-3">
    {/* Bot avatar */}
    <div className="w-7 h-7 rounded-full bg-[#1e2a4a] flex items-center justify-center flex-shrink-0 mt-0.5">
      <BotIcon className="w-4 h-4 text-[#6c8cff]" />
    </div>
    <div className="flex-1 min-w-0">
      {/* Agent label */}
      <p className="text-[12px] font-semibold text-[#7dd3a8] mb-1 uppercase tracking-wide">
        Claude
      </p>
      {/* Message body */}
      <div className="text-[15px] leading-[1.75] text-[#ececec] prose-bridge">
        {content}
      </div>
    </div>
  </div>
</div>
```

**User message block:**
```tsx
<div className="w-full max-w-[720px] mx-auto px-4 mb-6">
  <div className="flex items-start gap-3 justify-end">
    <div className="flex-1 min-w-0 flex flex-col items-end">
      {/* User label */}
      <p className="text-[12px] font-semibold text-[#9b9b9b] mb-1 uppercase tracking-wide">
        You
      </p>
      {/* Message body — slightly inset background for user */}
      <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 text-[15px] leading-[1.75] text-[#ececec] max-w-[85%]">
        {content}
      </div>
    </div>
    {/* User avatar */}
    <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0 mt-0.5">
      <UserIcon className="w-4 h-4 text-[#9b9b9b]" />
    </div>
  </div>
</div>
```

**Design rationale:** Bot messages are flat, no background — full-width prose like ChatGPT. User messages get a very subtle `bg-[#1a1a1a]` pill — just enough to distinguish without being a heavy bubble. Both align their label-then-content vertically.

**Streaming indicator** (while bot is typing):
```tsx
<span className="inline-flex gap-1">
  <span className="w-1.5 h-1.5 rounded-full bg-[#6c8cff] animate-bounce [animation-delay:0ms]" />
  <span className="w-1.5 h-1.5 rounded-full bg-[#6c8cff] animate-bounce [animation-delay:150ms]" />
  <span className="w-1.5 h-1.5 rounded-full bg-[#6c8cff] animate-bounce [animation-delay:300ms]" />
</span>
```

**Code blocks inside messages:**
```
bg-[#161616] border border-[#2a2a2a] rounded-lg
text-[13px] font-mono leading-[1.7] text-[#d4d4d4]
px-4 py-3 overflow-x-auto my-3
```

Code block header (language label + copy button):
```
flex items-center justify-between px-4 py-2
bg-[#1e1e1e] border-b border-[#2a2a2a] rounded-t-lg
text-[11px] font-semibold uppercase tracking-wider text-[#5c5c5c]
```

---

### 5.5 Agent Selector Dropdown

Appears in the chat header. Shows current agent name + model. Clicking opens a dropdown to switch agents.

**Trigger button:**
```tsx
<button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#ececec] hover:bg-[#1a1a1a] transition-colors duration-150 border border-transparent hover:border-[#2a2a2a]">
  <span className="w-2 h-2 rounded-full bg-[#7dd3a8]" /> {/* online indicator */}
  Claude 3.5 Sonnet
  <ChevronDown className="w-3.5 h-3.5 text-[#5c5c5c]" />
</button>
```

**Dropdown panel:**
```
absolute top-full left-0 mt-1 z-50
w-[240px] bg-[#181818] border border-[#2a2a2a] rounded-lg
shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1
```

**Dropdown item (default):**
```
flex items-center gap-3 px-3 py-2.5 cursor-pointer
text-[13px] text-[#ececec]
hover:bg-[#222222] transition-colors duration-100 rounded-md mx-1
```

**Dropdown item (active/selected):**
```
flex items-center gap-3 px-3 py-2.5 cursor-pointer
text-[13px] text-[#ececec] bg-[#1e2a4a]
rounded-md mx-1
```

Active item: show checkmark `<Check className="w-3.5 h-3.5 text-[#6c8cff] ml-auto" />`

**Agent icon dot colors** (each agent gets a unique dot):
- Claude: `bg-[#7dd3a8]` (mint green)
- Gemini: `bg-[#8ab4f8]` (google blue)
- GPT-4o: `bg-[#10a37f]` (OpenAI teal)
- Qwen: `bg-[#c084fc]` (purple)
- Free: `bg-[#fb923c]` (orange)

---

### 5.6 Input Bar

The input bar sits at the bottom of the chat panel, floating above a gradient fade.

**Outer wrapper** (gradient fade effect):
```
sticky bottom-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent pt-6 pb-4 px-4
```

**Input container** (the visible pill):
```
w-full max-w-[720px] mx-auto
bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl
flex items-end gap-2 px-4 py-3
focus-within:border-[#3a3a3a] focus-within:bg-[#1f1f1f]
transition-colors duration-150
shadow-[0_0_0_1px_rgba(108,140,255,0)] focus-within:shadow-[0_0_0_1px_rgba(108,140,255,0.15)]
```

**Textarea:**
```tsx
<textarea
  className="flex-1 bg-transparent resize-none outline-none text-sm text-[#ececec] placeholder:text-[#5c5c5c] leading-[1.6] max-h-[200px] min-h-[24px]"
  placeholder="Message Bridge Cloud..."
  rows={1}
/>
```
- Auto-resize with JS: starts at 1 row, grows up to ~5 rows before scrolling
- `onInput`: set `style.height = 'auto'; style.height = scrollHeight + 'px'`

**Send button (active — has text):**
```tsx
<button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6c8cff] hover:bg-[#5a7aee] transition-colors duration-150 flex-shrink-0 self-end mb-0.5">
  <ArrowUp className="w-4 h-4 text-[#0d0d0d]" strokeWidth={2.5} />
</button>
```

**Send button (disabled — empty input):**
```tsx
<button disabled className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] cursor-not-allowed flex-shrink-0 self-end mb-0.5">
  <ArrowUp className="w-4 h-4 text-[#5c5c5c]" strokeWidth={2.5} />
</button>
```

**Stop generation button** (while streaming):
```tsx
<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#3a3a3a] hover:bg-[#1a1a1a] transition-colors duration-150 flex-shrink-0 self-end mb-0.5">
  <Square className="w-3.5 h-3.5 text-[#ececec]" fill="currentColor" />
</button>
```

**Footer hint text** below input:
```
text-center text-[11px] text-[#5c5c5c] mt-2 select-none
```
Text: "Bridge Cloud can make mistakes. Verify important information."

---

## 6. Tailwind CSS v4 Config Additions

Tailwind v4 uses CSS-based configuration via `@theme` in your `globals.css` instead of `tailwind.config.js`. Add the following:

```css
@import "tailwindcss";

@theme {
  /* Font families */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;

  /* Bridge Cloud color tokens */
  --color-surface-base: #0d0d0d;
  --color-surface-sidebar: #111111;
  --color-surface-sidebar-hover: #1a1a1a;
  --color-surface-sidebar-active: #212121;
  --color-surface-input: #1a1a1a;
  --color-surface-input-focus: #1f1f1f;
  --color-surface-dropdown: #181818;
  --color-surface-dropdown-hover: #222222;
  --color-border-subtle: #2a2a2a;
  --color-border-strong: #3a3a3a;
  --color-text-primary: #ececec;
  --color-text-secondary: #9b9b9b;
  --color-text-muted: #5c5c5c;
  --color-text-inverse: #0d0d0d;
  --color-accent: #6c8cff;
  --color-accent-hover: #5a7aee;
  --color-accent-subtle: #1e2a4a;
  --color-bot-label: #7dd3a8;
  --color-user-label: #9b9b9b;
  --color-destructive: #e05c5c;

  /* Border radius scale */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
}

/* Thin custom scrollbar for sidebar + chat feed */
@layer base {
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #3a3a3a #111111;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #2a2a2a;
    border-radius: 9999px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: #3a3a3a;
  }

  /* Prose overrides for chat messages */
  .prose-bridge {
    color: #ececec;
  }
  .prose-bridge a {
    color: #6c8cff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .prose-bridge a:hover {
    color: #8aa8ff;
  }
  .prose-bridge strong {
    color: #ffffff;
    font-weight: 600;
  }
  .prose-bridge em {
    color: #d4d4d4;
  }
  .prose-bridge ul, .prose-bridge ol {
    padding-left: 1.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .prose-bridge li {
    margin-bottom: 0.25rem;
  }
  .prose-bridge hr {
    border-color: #2a2a2a;
    margin: 1.5rem 0;
  }
  .prose-bridge blockquote {
    border-left: 3px solid #2a2a2a;
    padding-left: 1rem;
    color: #9b9b9b;
    font-style: italic;
  }
  .prose-bridge code:not(pre code) {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    padding: 0.15em 0.4em;
    font-size: 0.875em;
    color: #d4d4d4;
    font-family: "JetBrains Mono", monospace;
  }
}
```

---

## 7. Animation & Motion

Keep animations minimal and fast. Nothing should feel "playful" — this is a productivity tool.

| Interaction | Duration | Easing | Tailwind |
|---|---|---|---|
| Sidebar item hover | 150ms | ease | `transition-colors duration-150` |
| Dropdown open | 120ms fade + 4px slide up | ease-out | CSS `@keyframes` |
| Send button state change | 150ms | ease | `transition-colors duration-150` |
| Input focus border | 150ms | ease | `transition-colors duration-150` |
| Streaming dot bounce | 600ms loop | ease-in-out | `animate-bounce` |
| Message appear | 200ms fade-in | ease | `animate-in fade-in duration-200` |

**Dropdown animation keyframes:**
```css
@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.dropdown-panel {
  animation: dropdown-in 120ms ease-out forwards;
}
```

---

## 8. Icon Usage (lucide-react)

Already installed. Use `w-4 h-4` as the default icon size. Key icons:

| Component | Icon | Size |
|---|---|---|
| New Chat button | `PenSquare` | `w-4 h-4` |
| Send button | `ArrowUp` | `w-4 h-4` |
| Stop button | `Square` | `w-3.5 h-3.5` |
| Agent selector chevron | `ChevronDown` | `w-3.5 h-3.5` |
| Agent selected checkmark | `Check` | `w-3.5 h-3.5` |
| Bot avatar | `Bot` | `w-4 h-4` |
| User avatar | `User` | `w-4 h-4` |
| Settings (sidebar bottom) | `Settings` | `w-4 h-4` |
| Delete conversation | `Trash2` | `w-3.5 h-3.5` |
| Copy code | `Copy` / `Check` | `w-3.5 h-3.5` |

---

## 9. Empty / Welcome State

When no conversation is active, show a centered welcome view in the chat panel.

```tsx
<div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
  {/* Logo mark */}
  <div className="w-12 h-12 rounded-2xl bg-[#1e2a4a] flex items-center justify-center mb-6">
    <Bot className="w-6 h-6 text-[#6c8cff]" />
  </div>

  <h1 className="text-2xl font-semibold text-[#ececec] mb-2">
    Bridge Cloud
  </h1>
  <p className="text-sm text-[#9b9b9b] mb-8 text-center max-w-[320px]">
    Your unified AI workspace. Choose an agent below and start a conversation.
  </p>

  {/* Quick-start suggestion chips */}
  <div className="flex flex-wrap gap-2 justify-center max-w-[480px]">
    {suggestions.map((s) => (
      <button
        key={s}
        className="px-3 py-2 rounded-lg border border-[#2a2a2a] text-[13px] text-[#9b9b9b] hover:bg-[#1a1a1a] hover:text-[#ececec] hover:border-[#3a3a3a] transition-colors duration-150"
      >
        {s}
      </button>
    ))}
  </div>
</div>
```

---

## 10. Responsive Behavior (Future)

MVP is desktop-only. Mobile adaptation in v2:
- Sidebar collapses to an off-canvas drawer triggered by hamburger menu
- Chat header gets a sidebar toggle icon `<Menu className="w-5 h-5" />`
- Input bar becomes full-width with no max-width constraint
- Message feed padding reduces to `px-3`

Breakpoint: `md` (768px) — below this, sidebar hides.

---

## 11. Accessibility Notes

- All interactive elements must have `:focus-visible` ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]`
- Color contrast: `#ececec` on `#0d0d0d` = 15.8:1 (AAA). `#9b9b9b` on `#0d0d0d` = 5.2:1 (AA).
- Textarea must have `aria-label="Chat input"` and `aria-multiline="true"`
- Agent selector trigger must have `aria-haspopup="listbox"` and `aria-expanded`
- Conversation list items must have `role="button"` and `tabIndex={0}`

---

## 12. File Structure Recommendation

```
src/
  app/
    globals.css          ← Add @theme tokens above
    layout.tsx           ← Root layout, Inter font load
    page.tsx             ← Main chat page
  components/
    layout/
      Sidebar.tsx
      ChatPanel.tsx
    chat/
      MessageFeed.tsx
      MessageBubble.tsx
      InputBar.tsx
      StreamingIndicator.tsx
      CodeBlock.tsx
      WelcomeScreen.tsx
    ui/
      AgentSelector.tsx
      NewChatButton.tsx
      Dropdown.tsx
  store/
    chatStore.ts         ← Zustand (already in deps)
  types/
    index.ts
```

---

*End of Bridge Cloud Design Spec v1.0*
