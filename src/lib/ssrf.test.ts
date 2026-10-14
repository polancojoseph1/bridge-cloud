import { describe, expect, it } from 'vitest';
import { isForbiddenHostname, isOpenRouterUrl } from './ssrf';

describe('isForbiddenHostname', () => {
  it('blocks trailing dots to prevent bypass', () => {
    expect(isForbiddenHostname('127.0.0.1.')).toBe(true);
    expect(isForbiddenHostname('127.0.0.1..')).toBe(true);
    expect(isForbiddenHostname('localhost.')).toBe(true);
    expect(isForbiddenHostname('169.254.169.254.')).toBe(true);
  });

  it('blocks known forbidden hosts without dots', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('localhost')).toBe(true);
  });

  it('allows valid external domains', () => {
    expect(isForbiddenHostname('example.com')).toBe(false);
    expect(isForbiddenHostname('example.com.')).toBe(false);
  });
});

describe('isOpenRouterUrl', () => {
    it('handles trailing dots', () => {
      expect(isOpenRouterUrl('https://openrouter.ai.')).toBe(true);
      expect(isOpenRouterUrl('https://openrouter.ai')).toBe(true);
      expect(isOpenRouterUrl('https://test.openrouter.ai.')).toBe(true);
      expect(isOpenRouterUrl('https://example.com.')).toBe(false);
    });
});
