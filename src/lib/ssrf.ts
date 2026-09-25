
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

  // IPv4 blocking (handles octal, hex, and dword formats)
  const parts = parseIPv4(cleanHn);
  if (parts) {
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

    // Extract underlying IPv4 if mapped (::ffff:x.x.x.x or ::ffff:x:y) or compatible (::x.x.x.x or ::x:y)
    let underlyingIpv4: string | null = null;

    // First check for direct dotted-decimal mapping e.g. ::127.0.0.1 or ::ffff:127.0.0.1
    const ipv4CompatMatch = cleanHn.match(/^::(?:ffff:)?(\d+\.\d+\.\d+\.\d+)$/);
    if (ipv4CompatMatch) {
      underlyingIpv4 = ipv4CompatMatch[1];
    } else {
      let ipv4Hex = cleanHn;
      if (cleanHn.startsWith('::ffff:')) ipv4Hex = cleanHn.substring(7);
      else if (cleanHn.startsWith('::')) ipv4Hex = cleanHn.substring(2);

      if (ipv4Hex && /^[0-9a-f]{1,4}:[0-9a-f]{1,4}$/i.test(ipv4Hex)) {
        const parts = ipv4Hex.split(':');
        const num = (parseInt(parts[0], 16) << 16) | parseInt(parts[1], 16);
        underlyingIpv4 = `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;
      }
    }

    if (underlyingIpv4) {
      const ipv4Parts = parseIPv4(underlyingIpv4);
      if (ipv4Parts) {
        if (ipv4Parts[0] === 0 || ipv4Parts[0] === 10 || ipv4Parts[0] === 127 ||
            (ipv4Parts[0] === 169 && ipv4Parts[1] === 254) ||
            (ipv4Parts[0] === 172 && ipv4Parts[1] >= 16 && ipv4Parts[1] <= 31) ||
            (ipv4Parts[0] === 192 && ipv4Parts[1] === 168)) {
          return true;
        }
      }
    }

    if (cleanHn.startsWith('::ffff:')) return true; // Catch any other IPv4-mapped
    if (/^[fF][cCdDeEfF]/.test(cleanHn)) return true; // Unique local address (fc00::/7)
    if (/^[fF][eE][89aAbB]/.test(cleanHn)) return true; // Link-local (fe80::/10)
    if (cleanHn.startsWith('100:')) return true; // RFC 6666 discard
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
