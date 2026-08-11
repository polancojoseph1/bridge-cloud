import { isForbiddenHostname } from './src/lib/ssrf';
console.log(isForbiddenHostname('0::1'));
console.log(isForbiddenHostname('0000:0000:0000:0000:0000:0000:0000:0001'));
console.log(isForbiddenHostname('::1'));
console.log(isForbiddenHostname('::'));
