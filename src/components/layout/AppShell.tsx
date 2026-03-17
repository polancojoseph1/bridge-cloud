'use client';
import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useServerStore } from '@/store/serverStore';
import Sidebar from './Sidebar';
import Header from './Header';
import ServerGate from '@/components/server/ServerGate';
import ConnectForm from '@/components/server/ConnectForm';
import { cn } from '@/lib/cn';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useChatStore(s => s.isSidebarOpen);
  const setSidebarOpen = useChatStore(s => s.setSidebarOpen);

  const profiles = useServerStore(s => s.profiles);
  const [gateStep, setGateStep] = useState<'gate' | 'local' | 'cloud' | null>(
    profiles.length === 0 ? 'gate' : null
  );

  // Watch for profiles being added (auto-dismiss gate)
  useEffect(() => {
    if (profiles.length > 0 && gateStep !== null) {
      setGateStep(null);
    }
  }, [profiles.length]);

  // Gate rendering (BEFORE the main return)
  if (gateStep === 'gate') {
    return <ServerGate onLocalSelect={() => setGateStep('local')} onCloudSelect={() => setGateStep('cloud')} />;
  }
  if (gateStep === 'local' || gateStep === 'cloud') {
    return (
      <ConnectForm
        tier={gateStep}
        onBack={() => setGateStep('gate')}
        onConnected={() => setGateStep(null)}
      />
    );
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
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
