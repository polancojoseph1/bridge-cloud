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

  // 🛡️ Sentinel: Use cryptographically secure fallback instead of predictable Math.random()
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Final fallback (should rarely be hit in modern environments)
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
