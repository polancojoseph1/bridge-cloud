'use client';
import { Menu } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import TopBarWrapper from '@/components/topbar/TopBarWrapper';

export default function Header() {
  const toggleSidebar = useChatStore(s => s.toggleSidebar);
  return (
    <div className="flex items-center h-12 px-3 border-b border-[#1e3025] bg-[#0a1410] flex-shrink-0">
      <button onClick={toggleSidebar} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-[#8e8e8e] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors mr-2">
        <Menu size={16} />
      </button>
      <TopBarWrapper />
    </div>
  );
}
