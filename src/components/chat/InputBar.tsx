'use client';

import { useRef, useState, useCallback, KeyboardEvent } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useOrchestrationStore } from '@/store/orchestrationStore';

// One line-height in px — used to cap auto-resize at 5 lines
const LINE_HEIGHT_PX = 24;
const MAX_LINES = 5;
const MAX_HEIGHT = LINE_HEIGHT_PX * MAX_LINES; // 120px

// ─── InputBar ─────────────────────────────────────────────────────────────────

/**
 * Fixed-bottom chat input.
 *
 * - Auto-resizing textarea: starts at 1 row, grows up to 5 lines, then scrolls.
 * - Enter submits; Shift+Enter inserts a newline.
 * - While streaming, send button is replaced by a Stop button.
 * - Subtle gradient fade above the bar blends the message feed into the input.
 */
export default function InputBar() {
  const isStreaming = useChatStore((s) => s.isStreaming);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const stopGeneration = useChatStore((s) => s.stopGeneration);
  const orchestrationMode = useOrchestrationStore((s) => s.mode);

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auto-resize ─────────────────────────────────────────────────────────────
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    // Reset height so shrinkage is detected correctly
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${next}px`;
    // Allow scrolling inside textarea once max height is reached
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resizeTextarea();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  }, [value, isStreaming, sendMessage]);

  const canSend = value.trim().length > 0 && !isStreaming && orchestrationMode === 'single';

  return (
    /*
     * Sticky bottom wrapper with a gradient fade so the message feed
     * smoothly fades into the input area rather than hard-cutting.
     */
    <div className="sticky bottom-0 bg-gradient-to-t from-[#0a1410] via-[#0a1410] to-transparent pt-6 pb-2 px-4">
      {/* Centered input pill */}
      <div className="w-full max-w-[720px] mx-auto">
        <div
          className={[
            'flex items-end gap-2 px-4 py-3',
            'bg-[#111f15] border rounded-xl',
            'transition-colors duration-150',
            isStreaming
              ? 'border-[#1e3025]'
              : 'border-[#1e3025] focus-within:border-[#2d4035] focus-within:bg-[#1f1f1f]',
            'focus-within:shadow-[0_0_0_1px_rgba(108,140,255,0.15)]',
          ].join(' ')}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            rows={1}
            placeholder="Message Bridge Cloud…"
            aria-label="Chat input"
            aria-multiline="true"
            className={[
              'flex-1 bg-transparent resize-none outline-none',
              'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
              'leading-[1.6] min-h-[24px] overflow-hidden',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          />

          {/* Send / Stop button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={stopGeneration}
              aria-label="Stop generation"
              title="Stop generation"
              className={[
                'w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 self-end mb-0.5',
                'border border-[#2d4035] hover:bg-[#111f15]',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
              ].join(' ')}
            >
              <Square className="w-3.5 h-3.5 text-[#ececec]" fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
              title={orchestrationMode === 'single' ? "Send message" : "Orchestration modes coming soon!"}
              className={[
                'w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 self-end mb-0.5',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
                canSend
                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'
                  : 'bg-[#1e3025] cursor-not-allowed',
              ].join(' ')}
            >
              <ArrowUp
                className={`w-4 h-4 ${canSend ? 'text-[#0a1410]' : 'text-[#5c5c5c]'}`}
                strokeWidth={2.5}
              />
            </button>
          )}
        </div>

        {/* Hint text */}
        <p className="text-center text-[11px] text-[#5c5c5c] mt-2 select-none">
          Bridge Cloud can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
