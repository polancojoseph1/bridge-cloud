import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-md',
        'text-[#8e8e8e] hover:text-[#ececec] hover:bg-[#152219]',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
