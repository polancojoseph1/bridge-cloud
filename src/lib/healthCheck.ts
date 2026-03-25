import type { HealthStatus } from '@/types';
import { isForbiddenHostname } from './ssrf';

export interface HealthCheckResult {
  status: HealthStatus;
  agentId?: string;
  botName?: string;
  error?: string;
}

export async function checkHealth(url: string, apiKey: string): Promise<HealthCheckResult> {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { status: 'offline', error: 'Server URL is required' };
  }

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return { status: 'auth_error', error: 'API key is required' };
  }

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
    if (isForbiddenHostname(hn)) {
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
