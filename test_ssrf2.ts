const cleanHn = '0::1';
let normalized = cleanHn;
try {
  normalized = new URL('http://[' + cleanHn + ']').hostname.slice(1, -1).toLowerCase();
} catch (e) {
}
console.log(normalized);

const cleanHn2 = '0000:0000:0000:0000:0000:0000:0000:0001';
let normalized2 = cleanHn2;
try {
  normalized2 = new URL('http://[' + cleanHn2 + ']').hostname.slice(1, -1).toLowerCase();
} catch (e) {
}
console.log(normalized2);

const cleanHn3 = 'fc00::1';
let normalized3 = cleanHn3;
try {
  normalized3 = new URL('http://[' + cleanHn3 + ']').hostname.slice(1, -1).toLowerCase();
} catch (e) {
}
console.log(normalized3);
