import { describe, it, expect } from 'vitest';
import { isForbiddenHostname, isOpenRouterUrl } from './ssrf';

describe('SSRF Protection', () => {
  describe('isForbiddenHostname', () => {
    it('blocks localhost', () => {
      expect(isForbiddenHostname('localhost')).toBe(true);
      expect(isForbiddenHostname('test.localhost')).toBe(true);
      expect(isForbiddenHostname('test.local')).toBe(true);
    });

    it('blocks IPv4 loopback and local network', () => {
      expect(isForbiddenHostname('127.0.0.1')).toBe(true);
      expect(isForbiddenHostname('0.0.0.0')).toBe(true);
      expect(isForbiddenHostname('10.0.0.1')).toBe(true);
      expect(isForbiddenHostname('192.168.1.1')).toBe(true);
      expect(isForbiddenHostname('172.16.0.1')).toBe(true);
    });

    it('blocks IPv6 loopback and unspecified', () => {
      expect(isForbiddenHostname('::1')).toBe(true);
      expect(isForbiddenHostname('::')).toBe(true);
    });

    it('blocks IPv4-compatible IPv6 normalized to hex (SSRF bypass attempt)', () => {
      // 127.0.0.1
      expect(isForbiddenHostname('::7f00:1')).toBe(true);
      expect(isForbiddenHostname('::7f00:0001')).toBe(true);

      // 10.0.0.1
      expect(isForbiddenHostname('::a00:1')).toBe(true);

      // 192.168.1.1
      expect(isForbiddenHostname('::c0a8:101')).toBe(true);
    });

    it('blocks IPv4-mapped IPv6 normalized to hex (SSRF bypass attempt)', () => {
      // ::ffff:127.0.0.1
      expect(isForbiddenHostname('::ffff:7f00:1')).toBe(true);
      expect(isForbiddenHostname('::ffff:7f00:0001')).toBe(true);

      // ::ffff:10.0.0.1
      expect(isForbiddenHostname('::ffff:a00:1')).toBe(true);

      // ::ffff:192.168.1.1
      expect(isForbiddenHostname('::ffff:c0a8:101')).toBe(true);
    });

    it('allows external IPv6 addresses that happen to have similar hex format', () => {
       // Should not block non-IPv4 mapped IPv6 (e.g. standard external IPs)
       expect(isForbiddenHostname('2606:4700:4700::1111')).toBe(false);
       expect(isForbiddenHostname('2001:db8::1')).toBe(false);
    });

    it('allows valid external hostnames', () => {
      expect(isForbiddenHostname('google.com')).toBe(false);
      expect(isForbiddenHostname('api.openai.com')).toBe(false);
      expect(isForbiddenHostname('8.8.8.8')).toBe(false);
    });
  });

  describe('isOpenRouterUrl', () => {
    it('identifies openrouter urls correctly', () => {
      expect(isOpenRouterUrl('https://openrouter.ai/api/v1/chat')).toBe(true);
      expect(isOpenRouterUrl('https://api.openrouter.ai/')).toBe(true);
      expect(isOpenRouterUrl('https://google.com')).toBe(false);
    });
  });
});
