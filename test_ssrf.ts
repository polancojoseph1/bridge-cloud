let cleanHn = "0000:0000:0000:0000:0000:0000:0000:0001";
let normalizedIpv6 = cleanHn;
try {
  normalizedIpv6 = new URL('http://[' + cleanHn + ']').hostname.slice(1, -1);
} catch {}
console.log("normalized:", normalizedIpv6);

cleanHn = "FC00:0000:0000:0000:0000:0000:0000:0001";
normalizedIpv6 = cleanHn;
try {
  normalizedIpv6 = new URL('http://[' + cleanHn + ']').hostname.slice(1, -1);
} catch {}
console.log("normalized 2:", normalizedIpv6);
