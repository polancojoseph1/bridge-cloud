const fs = require('fs');
let code = fs.readFileSync('src/components/chat/InputBar.tsx', 'utf8');

code = code.replace(
  /const canSend = value\.trim\(\)\.length > 0 && !isStreaming && orchestrationMode === 'single';/,
  "const canSend = value.trim().length > 0 && !isStreaming;"
);

code = code.replace(
  /canSend\s*\n\s*\? 'bg-\[\#6c8cff\] hover:bg-\[\#5a7aee\] cursor-pointer'\s*\n\s*: 'bg-\[\#1e3025\] cursor-not-allowed'/g,
  "canSend ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer' : 'bg-[#1e3025] cursor-not-allowed'"
);

code = code.replace(
  /className=\{`w-4 h-4 \$\{canSend \? 'text-\[\#0a1410\]' : 'text-\[\#5c5c5c\]'\}`\}/g,
  "className={`w-4 h-4 ${canSend ? 'text-[#0a1410]' : 'text-[#5c5c5c]'}`}"
);

fs.writeFileSync('src/components/chat/InputBar.tsx', code);
