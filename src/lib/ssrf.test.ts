import { describe, it, expect } from 'vitest';
import { isForbiddenHostname, isOpenRouterUrl } from './ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
    expect(isForbiddenHostname('sub.localhost')).toBe(true);
    expect(isForbiddenHostname('my.local')).toBe(true);
  });

  it('blocks dangerous IPv4', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('0.0.0.0')).toBe(true);
    expect(isForbiddenHostname('10.0.0.1')).toBe(true);
    expect(isForbiddenHostname('192.168.1.1')).toBe(true);
    expect(isForbiddenHostname('172.16.0.1')).toBe(true);
    expect(isForbiddenHostname('169.254.169.254')).toBe(true);
  });

  it('blocks dangerous IPv6', () => {
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('0000:0000:0000:0000:0000:0000:0000:0001')).toBe(true); // Should be true, but fails with current implementation
    expect(isForbiddenHostname('::')).toBe(true);
    expect(isForbiddenHostname('::ffff:127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('fc00::1')).toBe(true);
  });

  it('allows safe hostnames', () => {
    expect(isForbiddenHostname('api.openai.com')).toBe(false);
    expect(isForbiddenHostname('openrouter.ai')).toBe(false);
    expect(isForbiddenHostname('1.1.1.1')).toBe(false);
    expect(isForbiddenHostname('8.8.8.8')).toBe(false);
  });
});

describe('isOpenRouterUrl', () => {
  it('identifies openrouter urls correctly', () => {
    expect(isOpenRouterUrl('https://openrouter.ai/api/v1/chat/completions')).toBe(true);
    expect(isOpenRouterUrl('http://openrouter.ai')).toBe(true);
    expect(isOpenRouterUrl('https://api.openrouter.ai/v1/chat')).toBe(true);
  });

  it('rejects non-openrouter urls', () => {
    expect(isOpenRouterUrl('https://openai.com/api/v1')).toBe(false);
    expect(isOpenRouterUrl('https://google.com')).toBe(false);
    expect(isOpenRouterUrl('not a url')).toBe(false);
  });
});
