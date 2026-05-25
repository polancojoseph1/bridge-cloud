const fs = require('fs');
let code = fs.readFileSync('src/components/chat/InputBar.tsx', 'utf8');

// Replace orchestration mode validation so UI doesn't say "coming soon" and blocks inputs
code = code.replace(
  /disabled=\{!canSend\}/,
  "disabled={value.trim().length === 0 || isStreaming}"
);
code = code.replace(
  /canSend \? 'bg-\[\#6c8cff\] hover:bg-\[\#5a7aee\] cursor-pointer' : 'bg-\[\#1e3025\] cursor-not-allowed'/g,
  "value.trim().length > 0 && !isStreaming ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer' : 'bg-[#1e3025] cursor-not-allowed'"
);
code = code.replace(
  /canSend \? 'text-\[\#0a1410\]' : 'text-\[\#5c5c5c\]'/g,
  "value.trim().length > 0 && !isStreaming ? 'text-[#0a1410]' : 'text-[#5c5c5c]'"
);
code = code.replace(
  /if \(!trimmed \|\| isStreaming \|\| orchestrationMode !== 'single'\) return;/,
  "if (!trimmed || isStreaming) return;"
);
code = code.replace(
  /disabled=\{isStreaming \|\| orchestrationMode !== 'single'\}/,
  "disabled={isStreaming}"
);
code = code.replace(
  /placeholder=\{orchestrationMode === 'single' \? "Message Bridge Cloud…" : "Orchestration modes coming soon!"\}/,
  "placeholder=\"Message Bridge Cloud…\""
);
code = code.replace(
  /title=\{orchestrationMode === 'single' \? "Send message" : "Orchestration modes coming soon!"\}/,
  "title=\"Send message\""
);
fs.writeFileSync('src/components/chat/InputBar.tsx', code);
