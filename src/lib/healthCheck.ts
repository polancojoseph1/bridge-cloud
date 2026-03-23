import type { HealthStatus } from '@/types';

export interface HealthCheckResult {
  status: HealthStatus;
  agentId?: string;
  botName?: string;
  error?: string;
}

export async function checkHealth(url: string, apiKey: string): Promise<HealthCheckResult> {
  try {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { status: 'offline', error: 'Invalid URL format' };
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { status: 'offline', error: 'Invalid URL protocol' };
    }

    const hn = parsedUrl.hostname.toLowerCase();

    // Check for loopback, current network, AWS metadata, etc.
    if (
      hn === 'localhost' ||
      hn.includes('127.') ||
      hn === '0.0.0.0' ||
      hn.includes('169.254.') ||
      hn.match(/^10\./) ||
      hn.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hn.match(/^192\.168\./) ||
      hn === '[::1]' ||
      hn === '::1'
    ) {
      return { status: 'offline', error: 'Forbidden internal hostname or IP' };
    }

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
