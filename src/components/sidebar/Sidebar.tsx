'use client';

import { useMemo } from 'react';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { useChatStore } from '@/store/chatStore';
import { NewChatButton } from './NewChatButton';
import { ConversationItem } from './ConversationItem';
import type { Conversation } from '@/types';

/** Returns midnight (local) of the date `daysAgo` days before today. */
function startOfDayOffset(daysAgo: number): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.getTime();
}

interface GroupedConversations {
  today: ReturnType<typeof useChatStore.getState>['conversations'];
  yesterday: ReturnType<typeof useChatStore.getState>['conversations'];
  older: ReturnType<typeof useChatStore.getState>['conversations'];
}

/**
 * ⚡ Bolt Optimization: Custom equality function for conversations
 * 💡 What: Compares only the metadata fields (id, title, updatedAt) of the conversations.
 * 🎯 Why: When streaming a new message, the conversations array updates on every chunk because `messages` changes.
 *         This caused the entire Sidebar component to re-render constantly.
 *         By comparing only metadata, the Sidebar completely ignores message content updates.
 * 📊 Impact: Prevents Sidebar re-renders during message streaming. O(1) instead of O(chunks) re-renders.
 */
function compareConversationsMetadata(oldVal: Conversation[], newVal: Conversation[]) {
  if (oldVal.length !== newVal.length) return false;
  for (let i = 0; i < oldVal.length; i++) {
    const o = oldVal[i];
    const n = newVal[i];
    if (o.id !== n.id || o.title !== n.title || o.updatedAt !== n.updatedAt) {
      return false;
    }
  }
  return true;
}

export function Sidebar() {
  // Use the custom equality function to ignore `messages` changes
  const conversations = useStoreWithEqualityFn(useChatStore, (s) => s.conversations, compareConversationsMetadata);
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  const groups: GroupedConversations = useMemo(() => {
    const todayStart = startOfDayOffset(0);
    const yesterdayStart = startOfDayOffset(1);

    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

    // Optimize array filtering: replace O(3N) multiple .filter() calls with a single O(N) pass
    // to reduce memory allocations and prevent unnecessary React GC pauses during re-renders.
    return sorted.reduce<GroupedConversations>(
      (acc, c) => {
        if (c.updatedAt >= todayStart) {
          acc.today.push(c);
        } else if (c.updatedAt >= yesterdayStart) {
          acc.yesterday.push(c);
        } else {
          acc.older.push(c);
        }
        return acc;
      },
      { today: [], yesterday: [], older: [] }
    );
  }, [conversations]);

  const hasAny = conversations.length > 0;

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col h-full bg-[#111111] border-r border-[#1e3025]">

      {/* ── Top: logo + new chat ───────────────────────────────────────────── */}
      <div className="px-3 pt-4 pb-3 flex flex-col gap-3">
        {/* Wordmark */}
        <div className="px-1 flex items-center gap-2 select-none">
          <span className="text-base font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent leading-6">
            Bridge Cloud
          </span>
        </div>

        <NewChatButton />
      </div>

      {/* ── Conversation list (scrollable) ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 scrollbar-thin">
        {!hasAny && (
          <p className="px-3 py-6 text-[13px] text-[#5c5c5c] text-center select-none">
            No conversations yet
          </p>
        )}

        {groups.today.length > 0 && (
          <section>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5c5c5c] select-none">
              Today
            </p>
            {groups.today.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
              />
            ))}
          </section>
        )}

        {groups.yesterday.length > 0 && (
          <section>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5c5c5c] select-none">
              Yesterday
            </p>
            {groups.yesterday.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
              />
            ))}
          </section>
        )}

        {groups.older.length > 0 && (
          <section>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#5c5c5c] select-none">
              Older
            </p>
            {groups.older.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
              />
            ))}
          </section>
        )}
      </div>

      {/* ── Bottom: attribution ───────────────────────────────────────────── */}
      <div className="border-t border-[#1e3025] px-4 py-3">
        <p className="text-[11px] text-[#5c5c5c] select-none text-center">
          Powered by BridgeBot
        </p>
      </div>
    </aside>
  );
}
