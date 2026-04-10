'use client';
import { Menu } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import TopBarWrapper from '@/components/topbar/TopBarWrapper';

export default function Header() {
  const toggleSidebar = useChatStore(s => s.toggleSidebar);
  return (
    <nav data-testid="instance-tab-bar" className="flex items-center h-14 md:h-12 px-3 border-b border-[#1e3025] bg-[#0a1410] flex-shrink-0 w-full">
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-[#8e8e8e] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
      >
        <Menu size={24} />
      </button>
      <TopBarWrapper />
    </nav>
  );
}
