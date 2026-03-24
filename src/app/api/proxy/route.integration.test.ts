/**
 * Integration tests — require a live bridgebot server on localhost:8585.
 * Run with: BRIDGEBOT_CLAUDE_URL=http://localhost:8585 BRIDGEBOT_CLAUDE_KEY=<key> npm run test:integration
 * In CI, bridgebot is spun up by .github/workflows/integration.yml
 *
 * These tests validate the HTTP layer only — not actual AI responses.
 */

import { describe, it, expect } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const SKIP = !process.env.BRIDGEBOT_CLAUDE_URL?.includes('localhost');

function createRequest(body: object) {
  return { json: async () => body } as unknown as NextRequest;
}

describe.skipIf(SKIP)('Integration: POST /api/proxy → live bridgebot', () => {
  it('health check — bridgebot is reachable', async () => {
    const res = await fetch(`${process.env.BRIDGEBOT_CLAUDE_URL}/v1/health`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.status).toBe('ok');
  });

  it('rejects request with wrong API key (401)', async () => {
    const req = {
      json: async () => ({
        agentId: 'custom',
        serverUrl: process.env.BRIDGEBOT_CLAUDE_URL,
        serverKey: 'wrong-key',
        message: 'ping',
        conversationId: 'integration-test',
      }),
    } as unknown as NextRequest;

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('accepts request with correct API key and returns a response', async () => {
    const req = createRequest({
      agentId: 'claude',
      message: 'ping',
      conversationId: `integration-${Date.now()}`,
    });

    const res = await POST(req);
    // Bridgebot accepted the request — 200 (streaming) or 503 (CLI unavailable) both mean
    // the auth + routing layer is wired up correctly. We just reject 401/400.
    expect([200, 503]).toContain(res.status);
    if (res.status === 200) {
      expect(res.headers.get('Content-Type')).toBe('application/x-ndjson');
    }
  }, 10_000);
});
