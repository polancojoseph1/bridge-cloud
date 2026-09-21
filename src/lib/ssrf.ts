
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
  let cleanHn = hn.replace(/^\[|\]$/g, '').toLowerCase();

  // 🛡️ Sentinel: Normalize IP representations to catch SSRF bypasses (e.g. 0177.0.0.1, ::127.0.0.1)
  try {
    if (cleanHn.includes(':')) {
      cleanHn = new URL(`http://[${cleanHn}]`).hostname.slice(1, -1);
    } else {
      cleanHn = new URL(`http://${cleanHn}`).hostname;
    }
  } catch {
    // Fall back to original string if URL parsing fails
  }

  // Block localhost and .local domains
  if (cleanHn === 'localhost' || cleanHn.endsWith('.localhost') || cleanHn.endsWith('.local')) {
    return true;
  }

  // IPv6 blocking
  if (cleanHn.includes(':')) {
    if (cleanHn === '::1') return true; // Loopback
    if (cleanHn === '::') return true; // Unspecified

    // Node URL normalization converts ::ffff:127.0.0.1 to ::ffff:7f00:1
    if (cleanHn.startsWith('::ffff:')) {
      const parts = cleanHn.split(':');
      let hexPart = '';
      for (let i = 3; i < parts.length; i++) {
        if (parts[i]) hexPart += parts[i].padStart(4, '0');
      }
      if (hexPart.length > 0 && hexPart.length <= 8) {
        const ipv4Int = parseInt(hexPart.padEnd(8, '0'), 16);
        const p1 = (ipv4Int >>> 24) & 255;
        const p2 = (ipv4Int >>> 16) & 255;

        if (p1 === 0) return true; // 0.0.0.0/8
        if (p1 === 10) return true; // 10.0.0.0/8
        if (p1 === 127) return true; // 127.0.0.0/8
        if (p1 === 169 && p2 === 254) return true; // 169.254.0.0/16
        if (p1 === 172 && p2 >= 16 && p2 <= 31) return true; // 172.16.0.0/12
        if (p1 === 192 && p2 === 168) return true; // 192.168.0.0/16
      }
      return false; // Valid IPv4 mapped but not forbidden
    }

    if (/^[fF][cCdDeEfF]/.test(cleanHn)) return true; // Unique local address (fc00::/7)
    if (/^[fF][eE][89aAbB]/.test(cleanHn)) return true; // Link-local (fe80::/10)
    if (cleanHn.startsWith('100:')) return true; // RFC 6666 discard

    // Handle IPv4-compatible (::x:x) IPv6 addresses which normalize to 1 or 2 hex blocks after ::
    if (cleanHn.startsWith('::')) {
      const parts = cleanHn.split(':');
      if (parts.length <= 4 && parts.length > 2) {
        let hexPart = '';
        for (let i = 2; i < parts.length; i++) {
          if (parts[i]) hexPart += parts[i].padStart(4, '0');
        }
        if (hexPart.length > 0 && hexPart.length <= 8) {
          const ipv4Int = parseInt(hexPart.padEnd(8, '0'), 16);
          const p1 = (ipv4Int >>> 24) & 255;
          const p2 = (ipv4Int >>> 16) & 255;

          if (p1 === 0) return true; // 0.0.0.0/8
          if (p1 === 10) return true; // 10.0.0.0/8
          if (p1 === 127) return true; // 127.0.0.0/8
          if (p1 === 169 && p2 === 254) return true; // 169.254.0.0/16
          if (p1 === 172 && p2 >= 16 && p2 <= 31) return true; // 172.16.0.0/12
          if (p1 === 192 && p2 === 168) return true; // 192.168.0.0/16
        }
      }
    }
    return false;
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
