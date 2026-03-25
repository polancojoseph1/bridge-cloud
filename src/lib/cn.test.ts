import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges basic string classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn('class1', isTrue && 'class2', isFalse && 'class3')).toBe('class1 class2');
  });

  it('resolves Tailwind class conflicts', () => {
    // Tailwind-merge should pick the latter class
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('handles arrays and objects', () => {
    expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3');
  });

  it('ignores falsy values', () => {
    expect(cn('class1', null, undefined, false, 0, '')).toBe('class1');
  });
});
