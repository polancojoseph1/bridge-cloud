import { isForbiddenHostname } from './src/lib/ssrf';
console.log(isForbiddenHostname('0::1'));
