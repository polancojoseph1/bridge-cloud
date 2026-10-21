const fs = require('fs');
const file = 'src/components/input/SendButton.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /title={title}\n      aria-label={isStreaming \? 'Stop generating' : 'Send message'}\n      title={isStreaming \? 'Stop generating' : 'Send message'}/g,
  `aria-label={isStreaming ? 'Stop generating' : 'Send message'}\n      title={title || (isStreaming ? 'Stop generating' : 'Send message')}`
);
fs.writeFileSync(file, content);
