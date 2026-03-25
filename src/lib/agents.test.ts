import { describe, it, expect } from 'vitest';
import { getAgent, AGENTS } from './agents';

describe('getAgent', () => {
  it('should return the correct agent when a valid id is provided', () => {
    const agent = getAgent('gemini');
    expect(agent).toBeDefined();
    expect(agent.id).toBe('gemini');
    expect(agent.name).toBe('Gemini');

    const codex = getAgent('codex');
    expect(codex.id).toBe('codex');
  });

  it('should return the default (first) agent when an invalid id is provided', () => {
    const agent = getAgent('invalid-id');
    expect(agent).toBeDefined();
    expect(agent).toBe(AGENTS[0]);
    expect(agent.id).toBe('claude');
  });

  it('should return the default agent when an empty string is provided', () => {
    const agent = getAgent('');
    expect(agent).toBeDefined();
    expect(agent).toBe(AGENTS[0]);
    expect(agent.id).toBe('claude');
  });
});
