import { describe, it, expect } from 'vitest';
import { isForbiddenHostname } from './ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
    expect(isForbiddenHostname('test.local')).toBe(true);
  });

  it('blocks IPv4 local addresses', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('10.0.0.1')).toBe(true);
    expect(isForbiddenHostname('192.168.1.1')).toBe(true);
    expect(isForbiddenHostname('172.16.0.1')).toBe(true);
  });

  it('blocks IPv6 zero-compressed loopback', () => {
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('0::1')).toBe(true);
    expect(isForbiddenHostname('0000:0000:0000:0000:0000:0000:0000:0001')).toBe(true);
  });
});
