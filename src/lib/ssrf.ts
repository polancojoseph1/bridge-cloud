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

  // Exact matching for pure loopback and unspecified to avoid parsing as ipv4 0.0.0.1 and 0.0.0.0
  if (cleanHn === '::1' || cleanHn === '::') {
    return true;
  }

  // Extract embedded IPv4 from IPv4-mapped and IPv4-compatible IPv6 addresses.
  // Node's `new URL` normalizes [::192.168.1.1] to [::c0a8:101], so we check for both formats.
  let ipv4ToParse = cleanHn;
  let isEmbeddedIPv4 = false;

  if (cleanHn.includes(':')) {
    // IPv4-mapped IPv6 address (::ffff:w.x.y.z or ::ffff:hex)
    if (cleanHn.startsWith('::ffff:')) {
      const ipv4Part = cleanHn.substring(7);
      if (ipv4Part.includes('.')) {
         ipv4ToParse = ipv4Part;
         isEmbeddedIPv4 = true;
      } else if (ipv4Part.includes(':')) {
         const parts = ipv4Part.split(':');
         if (parts.length === 2) {
             ipv4ToParse = `0x${parts[0].padStart(4, '0')}${parts[1].padStart(4, '0')}`;
             isEmbeddedIPv4 = true;
         }
      } else if (ipv4Part !== '') {
         ipv4ToParse = `0x${ipv4Part}`;
         isEmbeddedIPv4 = true;
      }
    }
    // IPv4-compatible IPv6 address (::w.x.y.z or ::hex)
    else if (cleanHn.startsWith('::')) {
       const ipv4Part = cleanHn.substring(2);
       if (ipv4Part.includes('.')) {
          ipv4ToParse = ipv4Part;
          isEmbeddedIPv4 = true;
       } else if (ipv4Part.includes(':')) {
          const parts = ipv4Part.split(':');
          if (parts.length === 2 && !ipv4Part.includes('::')) {
             ipv4ToParse = `0x${parts[0].padStart(4, '0')}${parts[1].padStart(4, '0')}`;
             isEmbeddedIPv4 = true;
          }
       } else if (ipv4Part !== '') {
          ipv4ToParse = `0x${ipv4Part}`;
          isEmbeddedIPv4 = true;
      }
    }
  }

  // IPv4 blocking (handles octal, hex, and dword formats)
  const parts = parseIPv4(ipv4ToParse);
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
  if (cleanHn.includes(':') && !isEmbeddedIPv4) {
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
