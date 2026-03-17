import type { HealthStatus } from '@/types';

export interface HealthCheckResult {
  status: HealthStatus;
  agentId?: string;
  botName?: string;
  error?: string;
}

export async function checkHealth(url: string, apiKey: string): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${url}/v1/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: apiKey ? { 'X-API-Key': apiKey } : {},
    });
    clearTimeout(timeout);

    if (res.status === 401 || res.status === 403) {
      return { status: 'auth_error', error: 'API key rejected by server' };
    }
    if (!res.ok) {
      return { status: 'offline', error: `Server returned ${res.status}` };
    }

    const data = await res.json();
    return {
      status: 'online',
      agentId: data.agent_id,
      botName: data.bot_name,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { status: 'offline', error: 'Connection timed out after 8s' };
    }
    return { status: 'offline', error: err instanceof Error ? err.message : 'Network error' };
  }
}
