import { isForbiddenHostname } from './ssrf';
import { describe, it, expect } from 'vitest';

describe('isForbiddenHostname', () => {
  it('blocks ipv6 bypasses', () => {
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('0000::1')).toBe(true);
    expect(isForbiddenHostname('0:0:0:0:0:0:0:1')).toBe(true);
    expect(isForbiddenHostname('::ffff:127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('0:0:0:0:0:ffff:127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('::127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('0:0:0:0:0:0:127.0.0.1')).toBe(true);
  });
});
