const fs = require('fs');

const fixInputBar = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      `    if (!trimmed || isStreaming) return;\n    sendMessage(trimmed);`,
      `    if (!trimmed || isStreaming) return;\n    if (orchestrationMode !== 'single') {\n      // Graceful disable as not wired yet\n      return;\n    }\n    sendMessage(trimmed);`
    );
    // Add placeholder disabled states like ChatInputBar has
    content = content.replace(
      `            placeholder="Message Bridge Cloud..."\n            aria-label="Chat input"`,
      `            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud..." : "Orchestration modes coming soon!"}\n            aria-label="Chat input"`
    );
    content = content.replace(
      `            disabled={isStreaming}`,
      `            disabled={isStreaming || orchestrationMode !== 'single'}`
    );
    content = content.replace(
      `            disabled={!canSend}`,
      `            disabled={!canSend || orchestrationMode !== 'single'}`
    );
    fs.writeFileSync(file, content);
  }
};

fixInputBar('src/components/chat/InputBar.tsx');
