import { describe, it, expect } from 'vitest';
import { isForbiddenHostname } from './ssrf';

describe('isForbiddenHostname', () => {
  it('blocks localhost', () => {
    expect(isForbiddenHostname('localhost')).toBe(true);
    expect(isForbiddenHostname('localhost.')).toBe(true);
    expect(isForbiddenHostname('localhost..')).toBe(true);
  });

  it('blocks 127.0.0.1 variants', () => {
    expect(isForbiddenHostname('127.0.0.1')).toBe(true);
    expect(isForbiddenHostname('127.0.0.1.')).toBe(true);
    expect(isForbiddenHostname('0177.0.0.1.')).toBe(true);
    expect(isForbiddenHostname('0x7f000001.')).toBe(true);
    expect(isForbiddenHostname('127.0.0.1%2e')).toBe(true);
  });

  it('allows normal external domains', () => {
    expect(isForbiddenHostname('example.com')).toBe(false);
    expect(isForbiddenHostname('google.com.')).toBe(false);
  });
});
