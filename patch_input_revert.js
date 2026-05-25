const fs = require('fs');
let code = fs.readFileSync('src/components/chat/InputBar.tsx', 'utf8');

code = code.replace(
  /disabled=\{value.trim\(\).length === 0 \|\| isStreaming\}/g,
  "disabled={value.trim().length === 0 || isStreaming || orchestrationMode !== 'single'}"
);
code = code.replace(
  /const canSend = value.trim\(\)\.length > 0 && !isStreaming;/g,
  "const canSend = value.trim().length > 0 && !isStreaming && orchestrationMode === 'single';"
);
code = code.replace(
  /if \(!trimmed \|\| isStreaming\) return;/g,
  "if (!trimmed || isStreaming || orchestrationMode !== 'single') return;"
);
code = code.replace(
  /disabled=\{isStreaming\}/g,
  "disabled={isStreaming || orchestrationMode !== 'single'}"
);
code = code.replace(
  /placeholder="Message Bridge Cloud…"/g,
  "placeholder={orchestrationMode === 'single' ? \"Message Bridge Cloud…\" : \"Orchestration modes coming soon!\"}"
);
code = code.replace(
  /title="Send message"/g,
  "title={orchestrationMode === 'single' ? \"Send message\" : \"Orchestration modes coming soon!\"}"
);

fs.writeFileSync('src/components/chat/InputBar.tsx', code);
