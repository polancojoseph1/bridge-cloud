import { describe, it, expect } from 'vitest';
import { isForbiddenHostname } from './ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
    expect(isForbiddenHostname('foo.localhost')).toBe(true);
  });

  it('blocks private IPv4', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('10.0.0.1')).toBe(true);
    expect(isForbiddenHostname('192.168.1.1')).toBe(true);
  });

  it('blocks dangerous IPv6', () => {
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('::ffff:127.0.0.1')).toBe(true);
  });

  it('blocks IPv4-compatible and mapped IPv6 formats', () => {
    // Tests normalized URL hostname outputs
    expect(isForbiddenHostname('::7f00:1')).toBe(true);
    expect(isForbiddenHostname('::ffff:7f00:1')).toBe(true);
    expect(isForbiddenHostname('::ffff:0:7f00:1')).toBe(true);
    expect(isForbiddenHostname('::a9fe:a9fe')).toBe(true);
  });
});
