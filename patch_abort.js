const fs = require('fs');
let code = fs.readFileSync('src/store/chatStore.ts', 'utf8');

code = code.replace(/activeAbortController\.abort\(\);/, "activeAbortController.abort(new DOMException('Aborted', 'AbortError'));");

fs.writeFileSync('src/store/chatStore.ts', code);
