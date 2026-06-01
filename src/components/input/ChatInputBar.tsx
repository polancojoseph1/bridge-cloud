'use client';
import { useState, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useOrchestrationStore } from '@/store/orchestrationStore';
import SendButton from './SendButton';

export default function ChatInputBar() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isStreaming = useChatStore(s => s.isStreaming);
  const sendMessage = useChatStore(s => s.sendMessage);
  const stopGeneration = useChatStore(s => s.stopGeneration);
  const orchestrationMode = useOrchestrationStore(s => s.mode);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resizeTextarea();
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || orchestrationMode !== 'single') return;
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isEmpty = value.trim().length === 0;

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-[#0a1410] via-[#0a1410] to-transparent pt-6 pb-4 px-4 flex-shrink-0">
      <div className="w-full max-w-[720px] mx-auto">
        {/* Input container */}
        <div className="bg-[#152219] border border-[#2d4035] rounded-[14px] flex items-end gap-2 px-4 py-3 focus-within:border-[#3d5548] transition-colors duration-150">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || orchestrationMode !== 'single'}
            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud..." : "Orchestration modes coming soon!"}
            aria-label="Chat input"
            aria-multiline="true"
            rows={1}
            className="flex-1 bg-transparent text-[15px] text-[#ececec] placeholder-[#565656] resize-none outline-none leading-[1.65] min-h-[26px] max-h-[180px] overflow-y-auto disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ height: 'auto' }}
          />
          <SendButton
            disabled={isEmpty || orchestrationMode !== 'single'}
            isStreaming={isStreaming}
            onClick={isStreaming ? stopGeneration : handleSubmit}
            title={orchestrationMode === 'single' ? undefined : "Orchestration modes coming soon!"}
          />
        </div>
        {/* Footer hint */}
        <p className="text-[11px] text-[#565656] text-center mt-2">
          Bridge Cloud can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
