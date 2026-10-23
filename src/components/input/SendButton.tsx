import { ArrowUp, Square } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SendButtonProps {
  disabled: boolean;
  isStreaming: boolean;
  onClick: () => void;
  title?: string;
}

export default function SendButton({ disabled, isStreaming, onClick, title }: SendButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !isStreaming}
      title={title}
      aria-label={isStreaming ? 'Stop generating' : 'Send message'}
      className={cn(
        'w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 self-end mb-0.5',
        'transition-colors duration-150 active:scale-[0.94] transition-transform',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
        isStreaming
          ? 'bg-[#1e3025] border border-[#2d4035] cursor-pointer hover:bg-[#333]'
          : disabled
          ? 'bg-[#1e3025] opacity-50 cursor-not-allowed'
          : 'bg-[#10a37f] hover:bg-[#0d8f6f] cursor-pointer'
      )}
    >
      {isStreaming ? (
        <Square size={14} className="text-[#ececec] fill-[#ececec]" />
      ) : (
        <ArrowUp size={16} className={disabled ? 'text-[#565656]' : 'text-[#0a1410]'} />
      )}
    </button>
  );
}
