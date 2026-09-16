import { describe, it, expect } from 'vitest';
import { isForbiddenHostname } from '../src/lib/ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
    expect(isForbiddenHostname('test.localhost')).toBe(true);
  });

  it('blocks IPv4 loopback', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('127.0.0.2')).toBe(true);
    expect(isForbiddenHostname('2130706433')).toBe(true);
  });

  it('blocks IPv6 loopback and variations', () => {
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('0000::1')).toBe(true);
    expect(isForbiddenHostname('0:0:0:0:0:0:0:1')).toBe(true);
  });

  it('blocks unspecified IPv6 and variations', () => {
    expect(isForbiddenHostname('::')).toBe(true);
    expect(isForbiddenHostname('0:0:0:0:0:0:0:0')).toBe(true);
  });

  it('blocks IPv4-mapped IPv6', () => {
    expect(isForbiddenHostname('::ffff:127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('0:0:0:0:0:ffff:127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('::ffff:7f00:1')).toBe(true);
  });
});
