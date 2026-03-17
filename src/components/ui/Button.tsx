import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1410]',
        variant === 'primary' && 'bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410]',
        variant === 'ghost' && 'bg-transparent hover:bg-[#152219] text-[#8e8e8e] hover:text-[#ececec]',
        variant === 'icon' && 'bg-transparent hover:bg-[#152219] text-[#8e8e8e] hover:text-[#ececec] rounded-md',
        size === 'sm' && 'px-3 py-1.5 text-[13px]',
        size === 'md' && 'px-4 py-2 text-[14px]',
        size === 'lg' && 'px-5 py-2.5 text-[15px]',
        variant === 'icon' && 'w-8 h-8 p-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
