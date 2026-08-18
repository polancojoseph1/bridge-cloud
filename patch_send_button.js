const fs = require('fs');
let content = fs.readFileSync('src/components/input/SendButton.tsx', 'utf8');

content = content.replace(
  `      title={title}
      aria-label={isStreaming ? 'Stop generating' : 'Send message'}
      title={isStreaming ? 'Stop generating' : 'Send message'}`,
  `      aria-label={isStreaming ? 'Stop generating' : 'Send message'}
      title={title || (isStreaming ? 'Stop generating' : 'Send message')}`
);

fs.writeFileSync('src/components/input/SendButton.tsx', content);
