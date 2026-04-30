'use client';
import { Server, Cloud } from 'lucide-react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

interface ServerGateProps {
  onLocalSelect: () => void;
  onCloudSelect: () => void;
}

export default function ServerGate({ onLocalSelect, onCloudSelect }: ServerGateProps) {
  return (
    <div className="min-h-screen bg-[#0a1410] flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Top Right Auth */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-[#8e8e8e] hover:text-[#ececec] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm px-1">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-medium bg-[#1e3025] hover:bg-[#2a4334] text-[#ececec] px-3 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-[#10a37f] flex items-center justify-center">
          <span className="text-[#0a1410] text-2xl font-bold">B</span>
        </div>
        <h1 className="text-[26px] font-semibold text-[#ececec]">Bridge Cloud</h1>
        <p className="text-[14px] text-[#8e8e8e] text-center max-w-[340px]">
          Connect to a BridgeBot server to start chatting with your AI agents.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[560px]">
        {/* Local card */}
        <button
          onClick={onLocalSelect}
          className="flex-1 text-left p-6 rounded-xl bg-[#0e1c14] border border-[#2d4035] hover:border-[#3d5548] hover:bg-[#152219] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
        >
          <Server size={28} className="text-[#8e8e8e] mb-3" />
          <div className="text-[16px] font-semibold text-[#ececec] mb-1">Your Own Server</div>
          <div className="text-[13px] text-[#8e8e8e] leading-relaxed">
            Connect your BridgeBot instance. Bring your own Tailscale, ngrok, or public URL.
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#10a37f]">
            Connect a server →
          </div>
        </button>

        {/* Cloud card */}
        <div
          className="flex-1 flex flex-col p-6 rounded-xl bg-[#0e1c14] border border-[#2d4035] relative"
          style={{ boxShadow: '0 0 0 1px rgba(16,163,127,0.10)' }}
        >
          <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[rgba(16,163,127,0.12)] text-[11px] font-medium text-[#10a37f]">
            Managed Cloud
          </div>
          <Cloud size={28} className="text-[#10a37f] mb-3" />
          <div className="text-[16px] font-semibold text-[#ececec] mb-1">Bridge Cloud</div>
          <div className="text-[13px] text-[#8e8e8e] leading-relaxed mb-4 flex-1">
            Zero setup. Everything is provisioned for you. Paid service.
          </div>

          <Show when="signed-out">
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="flex-1 py-2 text-[13px] font-medium text-[#8e8e8e] bg-[#152219] border border-[#2d4035] hover:text-[#ececec] hover:border-[#3d5548] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 py-2 text-[13px] font-medium text-[#0a1410] bg-[#10a37f] hover:bg-[#0d8f6f] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <button
              onClick={onCloudSelect}
              className="w-full py-2 text-[13px] font-medium text-[#0a1410] bg-[#10a37f] hover:bg-[#0d8f6f] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
            >
              Connect to Cloud →
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
