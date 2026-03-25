import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, truncate, generateId } from './utils';

describe('utils', () => {
  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Set a fixed current time for tests: 2024-01-01T12:00:00.000Z
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "just now" for times less than a minute ago', () => {
      const now = Date.now();
      expect(formatRelativeTime(now - 1000)).toBe('just now'); // 1 second ago
      expect(formatRelativeTime(now - 59000)).toBe('just now'); // 59 seconds ago
    });

    it('returns "[X]m ago" for times between 1 minute and 59 minutes ago', () => {
      const now = Date.now();
      expect(formatRelativeTime(now - 60000)).toBe('1m ago'); // 1 minute ago
      expect(formatRelativeTime(now - 150000)).toBe('2m ago'); // 2.5 minutes ago
      expect(formatRelativeTime(now - 3540000)).toBe('59m ago'); // 59 minutes ago
    });

    it('returns "[X]h ago" for times between 1 hour and 23 hours ago', () => {
      const now = Date.now();
      expect(formatRelativeTime(now - 3600000)).toBe('1h ago'); // 1 hour ago
      expect(formatRelativeTime(now - 7200000)).toBe('2h ago'); // 2 hours ago
      expect(formatRelativeTime(now - 86399000)).toBe('23h ago'); // 23.99 hours ago
    });

    it('returns "[X]d ago" for times 1 day or more ago', () => {
      const now = Date.now();
      expect(formatRelativeTime(now - 86400000)).toBe('1d ago'); // 1 day ago
      expect(formatRelativeTime(now - 172800000)).toBe('2d ago'); // 2 days ago
      expect(formatRelativeTime(now - 2592000000)).toBe('30d ago'); // 30 days ago
    });
  });

  describe('truncate', () => {
    it('does not truncate string shorter than length', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('does not truncate string exactly matching length', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });

    it('truncates string longer than length and appends ellipsis', () => {
      expect(truncate('hello world', 5)).toBe('hello…');
    });

    it('handles empty strings', () => {
      expect(truncate('', 5)).toBe('');
    });

    it('handles n = 0', () => {
      expect(truncate('hello', 0)).toBe('…');
    });

    it('handles very large n', () => {
      expect(truncate('hello', 1000)).toBe('hello');
    });
  });

  describe('generateId', () => {
    it('generates a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('generates unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('uses crypto.randomUUID when available', () => {
      const mockUUID = '12345678-1234-1234-1234-123456789012';
      const originalCrypto = globalThis.crypto;

      globalThis.crypto = {
        randomUUID: vi.fn().mockReturnValue(mockUUID),
      } as any;

      const id = generateId();
      expect(globalThis.crypto.randomUUID).toHaveBeenCalled();
      expect(id).toBe(mockUUID);

      globalThis.crypto = originalCrypto;
    });

    it('falls back to Math.random when crypto.randomUUID is not available', () => {
      const originalCrypto = globalThis.crypto;
      // @ts-ignore
      delete globalThis.crypto;

      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(10); // Check it's not empty and has some length

      globalThis.crypto = originalCrypto;
    });
  });
});
