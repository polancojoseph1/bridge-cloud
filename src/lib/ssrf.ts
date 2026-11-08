
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

  let checkParts: number[] | null = null;

  // Handle IPv4-mapped and compatible IPv6 addresses like ::c0a8:101 or ::ffff:c0a8:101
  if (cleanHn.startsWith('::')) {
    if (cleanHn === '::1') return true; // Loopback
    if (cleanHn === '::') return true; // Unspecified

    let hexPart = '';
    if (cleanHn.startsWith('::ffff:')) {
      hexPart = cleanHn.slice(7);
    } else {
      hexPart = cleanHn.slice(2);
    }

    // Check if the remainder is valid IPv4 embedded hex (1 or 2 parts, max 4 chars each)
    if (/^[0-9a-f]{1,4}(:[0-9a-f]{1,4})?$/.test(hexPart)) {
      const hexParts = hexPart.split(':');
      let fullHex = '';
      if (hexParts.length === 2) {
        fullHex = hexParts[0].padStart(4, '0') + hexParts[1].padStart(4, '0');
      } else {
        fullHex = hexParts[0].padStart(8, '0');
      }

      const val = parseInt(fullHex, 16);
      if (!isNaN(val)) {
        checkParts = [
          (val >>> 24) & 255,
          (val >>> 16) & 255,
          (val >>> 8) & 255,
          val & 255,
        ];
      }
    }
  }

  // IPv4 blocking (handles octal, hex, and dword formats)
  if (!checkParts) {
    checkParts = parseIPv4(cleanHn);
  }

  if (checkParts) {
    if (checkParts[0] === 0) return true; // 0.0.0.0/8
    if (checkParts[0] === 10) return true; // 10.0.0.0/8
    if (checkParts[0] === 127) return true; // 127.0.0.0/8
    if (checkParts[0] === 169 && checkParts[1] === 254) return true; // 169.254.0.0/16
    if (checkParts[0] === 172 && checkParts[1] >= 16 && checkParts[1] <= 31) return true; // 172.16.0.0/12
    if (checkParts[0] === 192 && checkParts[1] === 168) return true; // 192.168.0.0/16

    return false;
  }

  // IPv6 blocking
  if (cleanHn.includes(':')) {
    if (cleanHn === '::1') return true; // Loopback
    if (cleanHn === '::') return true; // Unspecified
    if (cleanHn.startsWith('::ffff:')) return true; // IPv4-mapped IPv6 (fallback)
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
