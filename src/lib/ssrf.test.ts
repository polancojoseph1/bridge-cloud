import { describe, it, expect } from 'vitest';
import { isForbiddenHostname, isOpenRouterUrl } from './ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
    expect(isForbiddenHostname('my.localhost')).toBe(true);
    expect(isForbiddenHostname('my.local')).toBe(true);
  });

  it('blocks IPv4 loopback and local networks', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('192.168.1.1')).toBe(true);
    expect(isForbiddenHostname('10.0.0.1')).toBe(true);
    expect(isForbiddenHostname('172.16.0.1')).toBe(true);
    expect(isForbiddenHostname('169.254.169.254')).toBe(true); // AWS metadata
    expect(isForbiddenHostname('0.0.0.0')).toBe(true);
  });

  it('blocks IPv4 octal and hex encodings', () => {
    expect(isForbiddenHostname('0177.0.0.1')).toBe(true); // 127.0.0.1 in octal
    expect(isForbiddenHostname('0x7f.0.0.1')).toBe(true); // 127.0.0.1 in hex
    expect(isForbiddenHostname('2130706433')).toBe(true); // 127.0.0.1 as dword
  });

  it('blocks pure IPv6 loopback and unspecified', () => {
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('::')).toBe(true);
  });

  it('blocks IPv6 link-local and unique local addresses', () => {
    expect(isForbiddenHostname('fe80::1')).toBe(true);
    expect(isForbiddenHostname('fc00::1')).toBe(true);
    expect(isForbiddenHostname('100::1')).toBe(true);
  });

  it('blocks IPv4-mapped IPv6 addresses', () => {
    expect(isForbiddenHostname('::ffff:127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('::ffff:192.168.1.1')).toBe(true);
    expect(isForbiddenHostname('::ffff:10.0.0.1')).toBe(true);
    // Normalized by Node URL parser (hex packing)
    expect(isForbiddenHostname('::ffff:7f00:0001')).toBe(true);
    expect(isForbiddenHostname('::ffff:c0a8:0101')).toBe(true);
    expect(isForbiddenHostname('::ffff:7f00:1')).toBe(true);
  });

  it('blocks IPv4-compatible IPv6 addresses', () => {
    expect(isForbiddenHostname('::127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('::192.168.1.1')).toBe(true);
    expect(isForbiddenHostname('::10.0.0.1')).toBe(true);
    // Normalized by Node URL parser (hex packing)
    expect(isForbiddenHostname('::7f00:0001')).toBe(true);
    expect(isForbiddenHostname('::c0a8:0101')).toBe(true);
    expect(isForbiddenHostname('::7f00:1')).toBe(true);
  });

  it('allows external domains', () => {
    expect(isForbiddenHostname('example.com')).toBe(false); // NOTE: This is a placeholder assertion for test structure, should be false
  });
});
