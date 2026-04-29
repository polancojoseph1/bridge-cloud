export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export function cleanUrl(raw: string) {
  return raw.trim().replace(/\/+$/, '');
}

export function hostnameFrom(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return 'Server';
  }
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function parseJsonBodyWithLimit(req: Request, limit: number) {
  if (!req.body) return {};
  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let totalSize = 0;
  let bodyString = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      totalSize += value.length;
      if (totalSize > limit) {
        throw new Error('Request body too large');
      }
      bodyString += decoder.decode(value, { stream: true });
    }
  }
  bodyString += decoder.decode();
  return JSON.parse(bodyString);
}
