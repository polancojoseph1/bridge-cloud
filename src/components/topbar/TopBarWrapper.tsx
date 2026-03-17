'use client';

import { useChatStore } from '@/store/chatStore';
import TopBar from './TopBar';

/**
 * Connects TopBar to the Zustand store.
 * Separated from TopBar so TopBar stays a simple presentational component.
 */
export default function TopBarWrapper() {
  const activeAgentId = useChatStore((s) => s.activeAgentId);
  const setActiveAgent = useChatStore((s) => s.setActiveAgent);

  return (
    <TopBar
      activeAgentId={activeAgentId}
      onAgentSelect={setActiveAgent}
    />
  );
}
