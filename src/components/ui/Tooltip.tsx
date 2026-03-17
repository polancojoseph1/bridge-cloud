'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={cn(
          'absolute z-50 px-2 py-1 text-[11px] font-medium text-[#ececec] bg-[#1a2e22] border border-[#2d4035] rounded-md whitespace-nowrap shadow-lg pointer-events-none',
          side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
          side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1.5',
          side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-1.5',
          side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-1.5',
        )}>
          {content}
        </div>
      )}
    </div>
  );
}
