'use client';

import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import AgentSelector from './AgentSelector';

interface TopBarProps {
  activeAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export default function TopBar({ activeAgentId, onAgentSelect }: TopBarProps) {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const allowedEmails = ['josephpolanco909@gmail.com', 'diony.monday@gmail.com', 'dionymonday@gmail.com', 'jhanielbonilla@gmail.com'];
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  // Check if they are admin or if they bypass via testing mock keys
  const isAdmin = allowedEmails.includes(userEmail) || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');

  return (
    <div className="flex-1 flex justify-end items-center gap-4">
      
      {/* Auth section */}
      <div className="flex items-center gap-3">
        {isLoaded && user ? (
          <>
            {!isAdmin && (
               <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md border border-yellow-600/50 text-yellow-500 whitespace-nowrap bg-yellow-950/20">
                 Prototype Mode
               </span>
            )}
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-7 h-7' } }} />
          </>
        ) : (
          <button 
            onClick={() => openSignIn()} 
            className="text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-md bg-[#1e3025] hover:bg-[#2a4334] text-[#ececec] transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Agent selector right aligned */}
      <div className="flex items-center">
        <AgentSelector activeAgentId={activeAgentId} onSelect={onAgentSelect} />
      </div>
    </div>
  );
}
