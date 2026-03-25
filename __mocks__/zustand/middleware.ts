import { vi } from 'vitest';

export const persist = vi.fn((config, options) => {
  (config as any)._persistOptions = options;
  return config;
});
