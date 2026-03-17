'use client';
import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import AgentSelector from '@/components/agent/AgentSelector';
import ConversationList from '@/components/chat/ConversationList';
import ServerStatusIndicator from '@/components/server/ServerStatusIndicator';

export default function Sidebar() {
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

      {/* Server status */}
      <div className="flex-shrink-0 border-t border-[#1e3025] mt-auto">
        <ServerStatusIndicator />
      </div>
    </div>
  );
}
