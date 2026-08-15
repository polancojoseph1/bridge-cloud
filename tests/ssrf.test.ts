import { describe, it, expect } from 'vitest';
import { isForbiddenHostname } from '../src/lib/ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
  });
});
describe('isForbiddenHostname IPv6 normalization', () => {
  it('blocks equivalent representations of IPv6 loopback', () => {
    expect(isForbiddenHostname('0000:0000:0000:0000:0000:0000:0000:0001')).toBe(true);
    expect(isForbiddenHostname('0::1')).toBe(true);
    expect(isForbiddenHostname('::1')).toBe(true);
    expect(isForbiddenHostname('::FFFF:127.0.0.1')).toBe(true);
  });
});
