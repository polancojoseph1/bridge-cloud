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

    const res = await fetch('/api/proxy/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, apiKey }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.status === 401 || res.status === 403) {
      return { status: 'auth_error', error: 'API key rejected by server' };
    }
    if (!res.ok) {
      const errorMsg = await res.text().catch(() => '');
      return { status: 'offline', error: errorMsg || `Server returned ${res.status}` };
    }

    const data = await res.json();
    // In case the proxy returns its own wrapped result
    if (data.status) {
       return data;
    }

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
