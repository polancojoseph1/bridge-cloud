'use client';
import { memo } from 'react';
import { cn } from '@/lib/cn';
import type { Message } from '@/types';
import AgentBadge from '@/components/agent/AgentBadge';
import { useServerStore } from '@/store/serverStore';

interface MessageBubbleProps {
  message: Message;
}

/**
 * ⚡ Bolt Optimization: Added React.memo()
 * 💡 What: Prevents MessageBubble from re-rendering unless its specific `message` prop changes.
 * 🎯 Why: When streaming a new message, the parent MessageList re-renders on every chunk.
 *         Without memo, EVERY message in the history re-renders simultaneously, causing CPU spikes.
 * 📊 Impact: O(1) render cost during streaming instead of O(N) where N is chat history length.
 */
const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 mb-6 animate-message-in">
      {isUser ? (
        /* User message */
        <div className="flex flex-col items-end">
          <div className="text-[11px] text-[#9b9b9b] uppercase tracking-wide mb-1.5 font-medium">
            You
          </div>
          <div className="max-w-[75%] bg-[#1e3025] rounded-[12px_12px_4px_12px] px-4 py-3">
            <p className="text-[15px] leading-[1.65] text-[#ececec] whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>
      ) : (
        /* Assistant message */
        <div className="flex flex-col items-start">
          {message.agentId && (
            <div className="mb-2">
              <AgentBadge agentId={message.agentId} size="sm" />
            </div>
          )}
          <div className="w-full">
            {message.errorType === 'connection' ? (
              <div className="mt-1 flex flex-col items-start gap-3 bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-4">
                <p className="text-[14px] text-[#e0e0e0]">
                  No connection detected. Please connect to a model either locally or via our cloud service.
                </p>
                <button
                  onClick={() => useServerStore.getState().openManage()}
                  className="px-4 py-2 bg-[#2d4035] hover:bg-[#3d5548] text-[#ececec] text-[13px] font-medium rounded transition-colors"
                >
                  Connect Model
                </button>
              </div>
            ) : message.content ? (
              <p className={cn(
                'text-[15px] leading-[1.75] text-[#ececec] whitespace-pre-wrap break-words',
                message.isStreaming && 'stream-cursor'
              )}>
                {message.content}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
});

export default MessageBubble;
