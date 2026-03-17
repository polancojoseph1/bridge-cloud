# Bridge Cloud — Design System Specification

**Stack:** Next.js 16 · Tailwind CSS 4 · TypeScript · lucide-react
**Theme:** Dark only · Mobile-first · Minimalistic (ChatGPT-dark aesthetic)

---

## 1. Color Tokens

All colors are defined as CSS custom properties on `:root`. Tailwind 4 consumes them via `@theme`.

### Raw Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-base` | `#0d0d0d` | Page / outermost background |
| `--color-bg-surface` | `#171717` | Sidebar, modals, cards |
| `--color-bg-elevated` | `#1e1e1e` | Input bar, code blocks, hover states |
| `--color-bg-overlay` | `#252525` | Dropdowns, tooltips |
| `--color-border-subtle` | `#2a2a2a` | Dividers, bubble borders |
| `--color-border-default` | `#3a3a3a` | Input borders, card outlines |
| `--color-border-strong` | `#525252` | Focus rings (before accent) |
| `--color-accent` | `#10a37f` | Primary CTA, send button, active state (ChatGPT green) |
| `--color-accent-hover` | `#0d8f6f` | Hover state of accent |
| `--color-accent-muted` | `rgba(16,163,127,0.12)` | Agent badge background, subtle highlights |
| `--color-accent-alt` | `#7c6ef5` | Secondary accent — Gemini/AI purple badge |
| `--color-accent-alt-muted` | `rgba(124,110,245,0.12)` | Gemini badge background |
| `--color-text-primary` | `#ececec` | Body copy, message content |
| `--color-text-secondary` | `#8e8e8e` | Timestamps, meta, placeholder |
| `--color-text-tertiary` | `#565656` | Disabled states, ghost text |
| `--color-text-inverted` | `#0d0d0d` | Text on accent-colored surfaces |
| `--color-user-bubble` | `#2a2a2a` | User message bubble background |
| `--color-assistant-bubble` | `transparent` | Assistant has no bubble — text flush |
| `--color-destructive` | `#ef4444` | Error states, delete actions |
| `--color-destructive-muted` | `rgba(239,68,68,0.12)` | Error alert backgrounds |
| `--color-warning` | `#f59e0b` | Warning/retry states |
| `--color-code-bg` | `#141414` | Inline + block code background |

### CSS Variable Declaration

```css
/* globals.css */
:root {
  --color-bg-base:            #0d0d0d;
  --color-bg-surface:         #171717;
  --color-bg-elevated:        #1e1e1e;
  --color-bg-overlay:         #252525;

  --color-border-subtle:      #2a2a2a;
  --color-border-default:     #3a3a3a;
  --color-border-strong:      #525252;

  --color-accent:             #10a37f;
  --color-accent-hover:       #0d8f6f;
  --color-accent-muted:       rgba(16, 163, 127, 0.12);
  --color-accent-alt:         #7c6ef5;
  --color-accent-alt-muted:   rgba(124, 110, 245, 0.12);

  --color-text-primary:       #ececec;
  --color-text-secondary:     #8e8e8e;
  --color-text-tertiary:      #565656;
  --color-text-inverted:      #0d0d0d;

  --color-user-bubble:        #2a2a2a;
  --color-assistant-bubble:   transparent;

  --color-destructive:        #ef4444;
  --color-destructive-muted:  rgba(239, 68, 68, 0.12);
  --color-warning:            #f59e0b;

  --color-code-bg:            #141414;
}
```

### Tailwind 4 Theme Registration

```css
@theme inline {
  --color-bg-base:          var(--color-bg-base);
  --color-bg-surface:       var(--color-bg-surface);
  --color-bg-elevated:      var(--color-bg-elevated);
  --color-bg-overlay:       var(--color-bg-overlay);
  --color-border-subtle:    var(--color-border-subtle);
  --color-border-default:   var(--color-border-default);
  --color-border-strong:    var(--color-border-strong);
  --color-accent:           var(--color-accent);
  --color-accent-hover:     var(--color-accent-hover);
  --color-accent-muted:     var(--color-accent-muted);
  --color-accent-alt:       var(--color-accent-alt);
  --color-accent-alt-muted: var(--color-accent-alt-muted);
  --color-text-primary:     var(--color-text-primary);
  --color-text-secondary:   var(--color-text-secondary);
  --color-text-tertiary:    var(--color-text-tertiary);
  --color-text-inverted:    var(--color-text-inverted);
  --color-user-bubble:      var(--color-user-bubble);
  --color-destructive:      var(--color-destructive);
  --color-code-bg:          var(--color-code-bg);
}
```

---

## 2. Typography

**Font family:** `Geist Sans` (variable, already loaded) for UI · `Geist Mono` for code
**Base size:** `16px` (1rem)

### Type Scale

| Token | rem | px | Usage |
|---|---|---|---|
| `--text-xs` | `0.6875rem` | `11px` | Timestamps, labels |
| `--text-sm` | `0.8125rem` | `13px` | Sidebar items, meta text |
| `--text-base` | `0.9375rem` | `15px` | Message body (mobile) |
| `--text-md` | `1rem` | `16px` | Message body (desktop), inputs |
| `--text-lg` | `1.125rem` | `18px` | Section headers |
| `--text-xl` | `1.25rem` | `20px` | Page titles, empty state heading |
| `--text-2xl` | `1.5rem` | `24px` | Onboarding / splash heading |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| `--font-normal` | `400` | Message body, sidebar items |
| `--font-medium` | `500` | Button labels, input text |
| `--font-semibold` | `600` | Agent names, section titles |
| `--font-bold` | `700` | Display headings only |

### Line Heights

| Context | Value | Notes |
|---|---|---|
| Message body | `1.65` | Optimized for reading dense AI responses |
| UI labels | `1.4` | Sidebar items, buttons |
| Code blocks | `1.5` | Mono font, extra breathing room |
| Headings | `1.2` | Tight for display sizes |

### Responsive Typography Rules

```
Mobile  (< 640px):  message body = 15px / lh 1.65
Tablet  (640-1024): message body = 15px / lh 1.65
Desktop (> 1024px): message body = 16px / lh 1.7
```

---

## 3. Spacing Scale

Based on `4px` grid. All values in `rem` (assuming `16px` root).

| Token | rem | px | Tailwind class |
|---|---|---|---|
| `--space-0` | `0` | `0` | `p-0` |
| `--space-1` | `0.25rem` | `4px` | `p-1` |
| `--space-2` | `0.5rem` | `8px` | `p-2` |
| `--space-3` | `0.75rem` | `12px` | `p-3` |
| `--space-4` | `1rem` | `16px` | `p-4` |
| `--space-5` | `1.25rem` | `20px` | `p-5` |
| `--space-6` | `1.5rem` | `24px` | `p-6` |
| `--space-8` | `2rem` | `32px` | `p-8` |
| `--space-10` | `2.5rem` | `40px` | `p-10` |
| `--space-12` | `3rem` | `48px` | `p-12` |
| `--space-16` | `4rem` | `64px` | `p-16` |
| `--space-20` | `5rem` | `80px` | `p-20` |
| `--space-24` | `6rem` | `96px` | `p-24` |

### Key Layout Measurements

| Element | Value | Notes |
|---|---|---|
| Sidebar width (desktop) | `260px` | Fixed, collapses to overlay on mobile |
| Chat max-width | `720px` | Content column, centered |
| Input bar height (min) | `52px` | Grows with content (textarea) |
| Input bar max-height | `200px` | Scrollable beyond this |
| Message horizontal padding | `16px` mobile / `24px` desktop | |
| Message vertical gap | `24px` | Between messages |
| Bubble border-radius | `12px` | User bubble |
| Agent badge height | `22px` | Pill shape |
| Send button size | `36px × 36px` | Circle |
| Sidebar item height | `40px` | |
| Header height | `56px` | Top nav bar |

---

## 4. Component Visual Specs

### 4.1 Chat Bubble — User

```
Background:  #2a2a2a  (--color-user-bubble)
Text color:  #ececec  (--color-text-primary)
Border:      1px solid #3a3a3a  (--color-border-default)
Border-radius: 12px 12px 4px 12px  (bottom-right flattened)
Padding:     12px 16px
Max-width:   75% of chat column  (mobile: 88%)
Alignment:   flex-end (right-aligned)
Font-size:   15px mobile / 16px desktop
Line-height: 1.65
Margin:      0 0 24px auto
```

**Avatar:** 28px circle, `#10a37f` background, white initial letter, positioned top-right of message thread (not per-bubble, once per group).

### 4.2 Chat Bubble — Assistant

```
Background:  transparent  (no bubble — text flush with column)
Text color:  #ececec
Border:      none
Padding:     0  (horizontal padding comes from column)
Max-width:   100% of chat column
Alignment:   flex-start (left-aligned)
Font-size:   15px mobile / 16px desktop
Line-height: 1.65
Margin:      0 0 24px 0
```

**Avatar:** 28px circle, `#1e1e1e` background, `#8e8e8e` bot icon (lucide `Bot`), positioned top-left of each assistant group.

**Code blocks inside assistant messages:**
```
Background:  #141414  (--color-code-bg)
Border:      1px solid #2a2a2a
Border-radius: 8px
Padding:     12px 16px
Font-family: Geist Mono
Font-size:   13px
Overflow:    auto (horizontal scroll)
Header bar:  32px, #1e1e1e, language label left, copy button right
```

**Inline code:**
```
Background:  #1e1e1e
Border-radius: 4px
Padding:     2px 6px
Font-family: Geist Mono
Font-size:   0.875em (relative to surrounding text)
Color:       #ececec
```

### 4.3 Input Bar

The input bar is fixed to the bottom of the viewport on mobile, and pinned to the bottom of the chat column on desktop.

```
Outer wrapper:
  Background:    linear-gradient(to top, #0d0d0d 70%, transparent)
  Padding:       12px 16px 16px
  Width:         100%
  Max-width:     720px  (desktop, centered)

Inner container:
  Background:    #1e1e1e
  Border:        1px solid #3a3a3a
  Border-radius: 14px
  Padding:       10px 10px 10px 16px
  Display:       flex  align-items: flex-end  gap: 8px
  Transition:    border-color 150ms ease
  Focus-within:  border-color #525252

Textarea:
  Background:    transparent
  Border:        none
  Color:         #ececec
  Font-size:     15px
  Line-height:   1.6
  Resize:        none
  Min-height:    24px
  Max-height:    180px
  Flex:          1
  Outline:       none
  Placeholder:   color #565656, text "Message Bridge Cloud..."

Send button (idle — empty input):
  Size:          36×36px circle
  Background:    #2a2a2a
  Icon:          lucide ArrowUp, 18px, color #565656
  Border-radius: 50%
  Cursor:        not-allowed
  Opacity:       0.5

Send button (active — has text):
  Background:    #10a37f
  Icon:          color #0d0d0d
  Cursor:        pointer
  Transition:    background 150ms, transform 100ms
  Hover:         background #0d8f6f
  Active:        transform scale(0.94)

Left action area (optional):
  Attach button: 32×32px, lucide Paperclip, color #8e8e8e
  Gap from textarea: 4px
```

### 4.4 Sidebar

```
Width (desktop):     260px
Background:          #171717
Border-right:        1px solid #2a2a2a
Height:              100vh
Position:            fixed left-0 top-0 (desktop) / overlay (mobile)
Z-index:             40 (desktop sidebar) / 50 (mobile overlay)
Overflow-y:          auto
Padding:             8px 0

Mobile behavior:
  Default:           hidden (translateX(-100%))
  Open:              translateX(0), with backdrop overlay #0d0d0d/60%
  Transition:        transform 240ms cubic-bezier(0.4, 0, 0.2, 1)

Header area (top of sidebar):
  Height:            56px
  Padding:           0 12px
  Display:           flex align-items: center justify-content: space-between
  Border-bottom:     1px solid #2a2a2a

  Logo / app name:
    Font-size:       15px
    Font-weight:     600
    Color:           #ececec
    Letter-spacing:  -0.01em

  New chat button:
    32×32px, border-radius 8px
    Icon: lucide SquarePen, 18px, color #8e8e8e
    Hover: background #252525, icon color #ececec
    Transition: background 120ms, color 120ms

Conversation list item:
  Height:            40px
  Padding:           0 12px
  Border-radius:     8px
  Margin:            2px 8px
  Display:           flex align-items: center gap: 10px
  Cursor:            pointer
  Transition:        background 100ms

  Idle:   background transparent, text #8e8e8e
  Hover:  background #252525,    text #ececec
  Active: background #252525,    text #ececec, left 3px accent bar

  Icon:   lucide MessageSquare, 15px, color inherits from text
  Label:  truncate, font-size 14px, font-weight 400, line-height 1.4

Section label (Today / Yesterday / Older):
  Padding:     8px 20px 4px
  Font-size:   11px
  Font-weight: 500
  Color:       #565656
  Text-transform: uppercase
  Letter-spacing: 0.06em

Bottom area (user profile):
  Padding:     8px
  Border-top:  1px solid #2a2a2a
  Height:      56px
  Display:     flex align-items: center gap: 10px

  Avatar: 32px circle, background #2a2a2a, initials font-size 12px
  Name:   font-size 14px, color #ececec, flex-1, truncate
  Menu icon: lucide MoreHorizontal, 16px, color #565656
```

### 4.5 Agent Badge / Pill

Used to label which AI model/agent responded or is selected.

```
Shape:       pill  (border-radius: 999px)
Height:      22px
Padding:     0 8px
Display:     inline-flex  align-items: center  gap: 4px
Font-size:   11px
Font-weight: 500
Letter-spacing: 0.02em
Cursor:      default (label) / pointer (selector)

Variants:

  Claude / default:
    Background: rgba(16, 163, 127, 0.12)  (--color-accent-muted)
    Color:      #10a37f
    Border:     1px solid rgba(16, 163, 127, 0.20)
    Icon:       16×16px (lucide Zap or custom)

  Gemini:
    Background: rgba(124, 110, 245, 0.12)  (--color-accent-alt-muted)
    Color:      #7c6ef5
    Border:     1px solid rgba(124, 110, 245, 0.20)

  GPT / Codex:
    Background: rgba(255, 255, 255, 0.06)
    Color:      #8e8e8e
    Border:     1px solid rgba(255, 255, 255, 0.10)

  Qwen:
    Background: rgba(245, 158, 11, 0.10)
    Color:      #d97706
    Border:     1px solid rgba(245, 158, 11, 0.18)

  Error state:
    Background: rgba(239, 68, 68, 0.12)
    Color:      #f87171
    Border:     1px solid rgba(239, 68, 68, 0.20)

Model selector (dropdown trigger variant):
  Same base as above +
  Padding-right: 10px
  Hover: opacity 0.8, transition 120ms
  After icon: lucide ChevronDown, 12px

Position in chat:
  Placed immediately above assistant message group
  Margin-bottom: 4px
  Margin-left: 36px  (aligned past avatar)
```

### 4.6 Header / Top Nav

```
Height:      56px
Background:  #0d0d0d
Border-bottom: 1px solid #2a2a2a
Position:    sticky top-0
Z-index:     30
Padding:     0 16px
Display:     flex align-items: center gap: 12px

Mobile:
  Left:   hamburger (lucide Menu, 22px, color #8e8e8e)
  Center: current conversation title (truncated, font-size 15px, font-weight 500)
  Right:  new chat (lucide SquarePen, 22px) + optional overflow menu

Desktop (sidebar visible):
  Sidebar handles navigation
  Header shows: current agent badge (left), title (center), actions (right)
```

### 4.7 Empty State / Welcome Screen

```
Container:   centered, max-width 480px, padding 48px 24px
Icon:        64px, lucide BrainCircuit or Bot, color #3a3a3a
Heading:     "Bridge Cloud"  font-size 24px, font-weight 600, color #ececec, margin-top 16px
Subheading:  "Your AI gateway."  font-size 15px, color #8e8e8e, margin-top 8px

Suggestion chips:
  Displayed 2×2 grid (mobile: 1 col)
  Each chip:
    Background: #171717
    Border: 1px solid #2a2a2a
    Border-radius: 10px
    Padding: 12px 14px
    Font-size: 14px
    Color: #8e8e8e
    Hover: border-color #3a3a3a, color #ececec, transition 120ms
    Icon: 16px lucide icon left-aligned, color inherits
```

### 4.8 Typing Indicator

Three animated dots shown when an assistant is generating a response.

```
Container:   same layout as assistant message (left-aligned, past avatar)
Dots:        3 circles, 6px diameter, background #525252
Gap:         4px between dots
Padding:     10px 14px (inside a 28px tall pill: background #1e1e1e, border-radius 12px)
Animation:   bounce sequence (see Section 6)
```

---

## 5. Breakpoints

Mobile-first. All components default to mobile sizing.

| Name | Min-width | Description |
|---|---|---|
| `xs` | `0px` | Default mobile (320px baseline) |
| `sm` | `640px` | Large phones, small tablets |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Desktop (sidebar becomes visible) |
| `xl` | `1280px` | Wide desktop |
| `2xl` | `1536px` | Ultra-wide (same layout, more whitespace) |

### Layout Behavior by Breakpoint

```
xs–md (< 1024px):
  - Sidebar: hidden by default, opens as full-height overlay
  - Backdrop: #0d0d0d at 60% opacity, closes sidebar on tap
  - Chat column: 100vw
  - Input bar: fixed bottom, full width, no rounded outer wrapper
  - Header: visible (56px)
  - Message padding: 16px horizontal

lg+ (≥ 1024px):
  - Sidebar: permanent fixture, 260px, fixed left
  - Chat column: calc(100vw - 260px), content max-width 720px centered
  - Input bar: sticky bottom of scroll area, max-width 720px centered
  - Header: minimal (sidebar handles nav)
  - Message padding: 24px horizontal

xl+ (≥ 1280px):
  - No layout change; increased gutter whitespace on chat column sides
  - Message text: 16px (bumped from 15px)
```

### Tailwind Tailored Classes (examples)

```tsx
// Sidebar visibility
<nav className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] ..." />

// Mobile sidebar overlay
<nav className="fixed inset-y-0 left-0 w-[260px] lg:hidden translate-x-[-100%]
                data-[open=true]:translate-x-0 transition-transform duration-[240ms]
                ease-[cubic-bezier(0.4,0,0.2,1)] z-50" />

// Chat column
<main className="flex-1 lg:ml-[260px] flex flex-col items-center" />

// Message padding
<div className="px-4 lg:px-6 max-w-[720px] w-full mx-auto" />
```

---

## 6. Animations

All animations are **subtle and fast**. Motion should feel instant, not decorative.

### 6.1 Message Appear

New messages slide up and fade in from 8px below.

```css
@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-appear {
  animation: message-in 180ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
```

Tailwind utility (via `@layer utilities`):
```css
@layer utilities {
  .animate-message-in {
    animation: message-in 180ms cubic-bezier(0.4, 0, 0.2, 1) both;
  }
}
```

### 6.2 Typing Indicator (Bounce Dots)

Staggered bounce. Each dot delays by 120ms.

```css
@keyframes typing-dot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.typing-dot {
  animation: typing-dot 1.2s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.12s; }
.typing-dot:nth-child(3) { animation-delay: 0.24s; }
```

### 6.3 Sidebar Slide (Mobile)

```css
/* Applied via data attribute toggling */
.sidebar {
  transition: transform 240ms cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar[data-open="false"] {
  transform: translateX(-100%);
}
.sidebar[data-open="true"] {
  transform: translateX(0);
}

/* Backdrop */
.sidebar-backdrop {
  transition: opacity 240ms ease;
}
.sidebar-backdrop[data-open="false"] {
  opacity: 0;
  pointer-events: none;
}
.sidebar-backdrop[data-open="true"] {
  opacity: 1;
  pointer-events: auto;
}
```

### 6.4 Send Button State Change

```css
/* Input idle → active transition */
.send-btn {
  transition: background-color 150ms ease, transform 100ms ease;
}
.send-btn:active {
  transform: scale(0.94);
}
```

### 6.5 Conversation Item Hover

```css
.conv-item {
  transition: background-color 100ms ease, color 100ms ease;
}
```

### 6.6 Streaming Text Cursor

Blinking cursor shown at the end of in-progress AI responses.

```css
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.stream-cursor::after {
  content: '▋';
  display: inline-block;
  color: #10a37f;
  font-size: 0.9em;
  animation: cursor-blink 800ms step-start infinite;
  margin-left: 1px;
}
```

### 6.7 Agent Badge Appear

Fade in with a tiny upward nudge — same as message-in but shorter duration.

```css
@keyframes badge-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-badge-in {
  animation: badge-in 120ms ease both;
}
```

### 6.8 General Interaction Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Buttons (all) | `background-color`, `color` | `120ms` | `ease` |
| Input border | `border-color` | `150ms` | `ease` |
| Sidebar item | `background-color`, `color` | `100ms` | `ease` |
| Send button activate | `background-color` | `150ms` | `ease` |
| Send button press | `transform` | `100ms` | `ease` |
| Sidebar open/close | `transform` | `240ms` | `cubic-bezier(0.4,0,0.2,1)` |
| Backdrop | `opacity` | `240ms` | `ease` |
| Message appear | `opacity`, `transform` | `180ms` | `cubic-bezier(0.4,0,0.2,1)` |
| Streaming cursor | `opacity` | `800ms` | `step-start` |

---

## 7. Tailwind 4 Configuration Notes

Tailwind 4 uses a CSS-first config (no `tailwind.config.js`). All theme extensions go in `globals.css`.

```css
/* Full globals.css structure */

@import "tailwindcss";

/* 1. CSS custom properties */
:root {
  /* ... all --color-* tokens from Section 1 ... */
}

/* 2. Register with Tailwind theme */
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --color-bg-base:            var(--color-bg-base);
  --color-bg-surface:         var(--color-bg-surface);
  /* ... rest of colors ... */
}

/* 3. Base layer resets */
@layer base {
  html {
    background-color: var(--color-bg-base);
    color: var(--color-text-primary);
    font-family: var(--font-sans), system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  /* Scrollbar (webkit) */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: #2a2a2a;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
}

/* 4. Custom keyframes + utilities */
@layer utilities {
  /* ... animations from Section 6 ... */
}
```

---

## 8. Component File Structure (Recommended)

```
src/
  components/
    chat/
      ChatBubble.tsx          # user + assistant variants
      ChatBubbleCode.tsx      # code block inside assistant
      TypingIndicator.tsx
      MessageList.tsx         # scrolling message container
      StreamCursor.tsx
    input/
      InputBar.tsx            # textarea + send button
      SendButton.tsx
    sidebar/
      Sidebar.tsx
      ConversationItem.tsx
      SidebarBackdrop.tsx
    ui/
      AgentBadge.tsx          # pill component, all variants
      Avatar.tsx              # 28px / 32px circle
      IconButton.tsx          # standardized icon button
    layout/
      AppShell.tsx            # sidebar + header + main column
      Header.tsx
  lib/
    cn.ts                     # clsx + tailwind-merge helper
  app/
    globals.css               # all tokens, theme, keyframes
    layout.tsx
    page.tsx
```

### `cn` utility

```ts
// src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 9. Quick Reference Card

| Need | Token / Class |
|---|---|
| Page background | `bg-bg-base` / `#0d0d0d` |
| Surface (sidebar, modal) | `bg-bg-surface` / `#171717` |
| Hover surface | `bg-bg-elevated` / `#1e1e1e` |
| Primary text | `text-text-primary` / `#ececec` |
| Muted text | `text-text-secondary` / `#8e8e8e` |
| Divider | `border-border-subtle` / `#2a2a2a` |
| Input border | `border-border-default` / `#3a3a3a` |
| Accent (green) | `text-accent` / `bg-accent` / `#10a37f` |
| Accent (purple) | `text-accent-alt` / `#7c6ef5` |
| Code background | `bg-code-bg` / `#141414` |
| Message appear | `animate-message-in` |
| Sidebar transition | `transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]` |
| Subtle transition | `transition-colors duration-[120ms] ease` |
