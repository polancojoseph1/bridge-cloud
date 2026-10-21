const fs = require('fs');

const fixChatInputBar = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      `  const handleSubmit = async () => {\n    const trimmed = value.trim();\n    if (!trimmed || isStreaming || orchestrationMode !== 'single') return;\n    setValue('');\n    if (textareaRef.current) {\n      textareaRef.current.style.height = 'auto';\n    }\n    await sendMessage(trimmed);\n  };`,
      `  const handleSubmit = async () => {\n    const trimmed = value.trim();\n    if (!trimmed || isStreaming) return;\n    setValue('');\n    if (textareaRef.current) {\n      textareaRef.current.style.height = 'auto';\n    }\n    if (orchestrationMode !== 'single') {\n      // Orchestration modes feature stub/graceful degradation if not fully wired\n      // Currently just disabled via UI conditionally\n      return;\n    }\n    await sendMessage(trimmed);\n  };`
    );
    fs.writeFileSync(file, content);
  }
};

fixChatInputBar('src/components/input/ChatInputBar.tsx');
