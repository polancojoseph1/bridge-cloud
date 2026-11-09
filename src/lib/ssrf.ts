
function parseIPv4(ip: string): number[] | null {
  let parts: string[];
  if (ip.includes('.')) {
    parts = ip.split('.');
  } else {
    parts = [ip];
  }
  if (parts.length === 0 || parts.length > 4) return null;

  const parsedParts: number[] = [];
  for (const p of parts) {
    if (!/^(0x[0-9a-fA-F]+|0[0-7]*|[1-9][0-9]*)$/.test(p)) return null;
    let n: number;
    if (p.startsWith('0x') || p.startsWith('0X')) {
      n = parseInt(p, 16);
    } else if (p.startsWith('0') && p.length > 1) {
      n = parseInt(p, 8);
    } else {
      n = parseInt(p, 10);
    }
    if (isNaN(n)) return null;
    parsedParts.push(n);
  }

  const last = parsedParts.pop()!;
  if (last >= Math.pow(256, 5 - parsedParts.length)) return null;

  for (const p of parsedParts) {
    if (p > 255) return null;
  }

  const result = [...parsedParts];
  let remaining = last;
  for (let i = 4 - parsedParts.length; i > 0; i--) {
    result.push(Math.floor(remaining / Math.pow(256, i - 1)) % 256);
  }

  return result;
}

export function isForbiddenHostname(hn: string): boolean {
  const cleanHn = hn.replace(/^\[|\]$/g, '').toLowerCase();

  // Block localhost and .local domains
  if (cleanHn === 'localhost' || cleanHn.endsWith('.localhost') || cleanHn.endsWith('.local')) {
    return true;
  }

  // Handle mapped IPv4 in IPv6
  let ipv4CheckStr = cleanHn;
  if (cleanHn.includes(':')) {
    if (cleanHn === '::1') return true; // Loopback
    if (cleanHn === '::') return true; // Unspecified
    if (/^[fF][cCdDeEfF]/.test(cleanHn)) return true; // Unique local address (fc00::/7)
    if (/^[fF][eE][89aAbB]/.test(cleanHn)) return true; // Link-local (fe80::/10)
    if (cleanHn.startsWith('100:')) return true; // RFC 6666 discard

    // Check if it's an IPv4-mapped or IPv4-compatible address
    const hnParts = cleanHn.split(':');
    if (hnParts.length > 2) {
      const lastPart = hnParts[hnParts.length - 1];
      const secondLastPart = hnParts[hnParts.length - 2];

      // Node URL normalizing produces ::c0a8:101 or ::ffff:c0a8:101
      if (cleanHn.startsWith('::ffff:') && !cleanHn.includes('.')) {
         if (hnParts.length === 5) {
            const p1 = parseInt(secondLastPart, 16);
            const p2 = parseInt(lastPart, 16);
            if (!isNaN(p1) && !isNaN(p2)) {
               ipv4CheckStr = `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
            }
         }
      } else if (cleanHn.startsWith('::') && hnParts.length === 4 && !cleanHn.includes('.')) {
         const p1 = parseInt(secondLastPart, 16);
         const p2 = parseInt(lastPart, 16);
         if (!isNaN(p1) && !isNaN(p2)) {
               ipv4CheckStr = `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
         }
      } else if (cleanHn.startsWith('::ffff:')) {
         ipv4CheckStr = lastPart;
      } else if (cleanHn.startsWith('::') && hnParts.length === 3 && lastPart.includes('.')) {
         ipv4CheckStr = lastPart;
      }
    }
  }

  // IPv4 blocking (handles octal, hex, and dword formats)
  const parts = parseIPv4(ipv4CheckStr);
  if (parts) {
    if (parts[0] === 0) return true; // 0.0.0.0/8
    if (parts[0] === 10) return true; // 10.0.0.0/8
    if (parts[0] === 127) return true; // 127.0.0.0/8
    if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16

    return false;
  }

  return false;
}

export function isOpenRouterUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hn = parsedUrl.hostname.toLowerCase();
    return hn === 'openrouter.ai' || hn.endsWith('.openrouter.ai');
  } catch {
    return false;
  }
}
