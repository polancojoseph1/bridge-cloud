export function isForbiddenHostname(hn: string): boolean {
  const cleanHn = hn.replace(/^\[|\]$/g, '').toLowerCase();

  // Block localhost and .local domains
  if (cleanHn === 'localhost' || cleanHn.endsWith('.localhost') || cleanHn.endsWith('.local')) {
    return true;
  }

  // IPv4 blocking (handles formats correctly due to new URL() normalizing them to standard dotted decimal)
  const ipv4Match = cleanHn.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const parts = ipv4Match.slice(1).map(Number);
    if (parts[0] === 0) return true; // 0.0.0.0/8
    if (parts[0] === 10) return true; // 10.0.0.0/8
    if (parts[0] === 127) return true; // 127.0.0.0/8
    if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16

    return false;
  }

  // IPv6 blocking
  if (cleanHn.includes(':')) {
    if (cleanHn === '::1') return true; // Loopback
    if (cleanHn === '::') return true; // Unspecified
    if (cleanHn.startsWith('::ffff:')) return true; // IPv4-mapped IPv6
    if (/^[fF][cCdDeEfF]/.test(cleanHn)) return true; // Unique local address (fc00::/7)
    if (/^[fF][eE][89aAbB]/.test(cleanHn)) return true; // Link-local (fe80::/10)
    if (cleanHn.startsWith('100:')) return true; // RFC 6666 discard
  }

  return false;
}
