'use client';
import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useServerStore } from '@/store/serverStore';
import Sidebar from './Sidebar';
import Header from './Header';
import ServerGate from '@/components/server/ServerGate';
import ConnectForm from '@/components/server/ConnectForm';
import ServerManageModal from '@/components/server/ServerManageModal';
import { cn } from '@/lib/cn';

// If the deployment pre-configures a server via env vars, auto-seed the profile
// so the user never sees the ServerGate on first load.
const PRECONFIGURED_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? '';
const PRECONFIGURED_KEY = process.env.NEXT_PUBLIC_SERVER_KEY ?? '';
const PRECONFIGURED_AGENT = process.env.NEXT_PUBLIC_SERVER_AGENT_ID ?? 'claude';
const IS_PRECONFIGURED = process.env.NEXT_PUBLIC_SERVER_PRECONFIGURED === 'true';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useChatStore(s => s.isSidebarOpen);
  const setSidebarOpen = useChatStore(s => s.setSidebarOpen);

  const profiles = useServerStore(s => s.profiles);
  const addProfile = useServerStore(s => s.addProfile);

  // Seed the pre-configured server profile on first render if the store is empty.
  // This runs once — afterwards the persisted store keeps the profile across reloads.
  useEffect(() => {
    if (IS_PRECONFIGURED && PRECONFIGURED_URL && PRECONFIGURED_KEY && profiles.length === 0) {
      addProfile({
        name: 'Bridge Cloud',
        tier: 'cloud',
        agentId: PRECONFIGURED_AGENT,
        url: PRECONFIGURED_URL,
        apiKey: PRECONFIGURED_KEY,
        isDefault: true,
        cloudProvisionStatus: 'provisioned',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  const [gateStep, setGateStep] = useState<'gate' | 'local' | 'cloud' | null>(
    // If pre-configured and a URL is present, start with no gate (profile seeds async via useEffect above)
    IS_PRECONFIGURED && PRECONFIGURED_URL ? null : profiles.length === 0 ? 'gate' : null
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

      {/* Server Manager Modal */}
      <ServerManageModal />
    </div>
  );
}
