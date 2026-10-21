const fs = require('fs');

const fixInputBar = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes("if (orchestrationMode !== 'single')")) {
        content = content.replace(
          "if (!trimmed || isStreaming) return;",
          `if (!trimmed || isStreaming) return;
    if (orchestrationMode !== 'single') {
      const { runOrchestration } = await import('@/lib/orchestration');
      const { useOrchestrationStore } = await import('@/store/orchestrationStore');
      runOrchestration(trimmed, useOrchestrationStore.getState().onlineNodes(), useOrchestrationStore.getState().pipelineOrder, orchestrationMode);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.overflowY = 'hidden';
      }
      return;
    }`
        );
        fs.writeFileSync(file, content);
    }
  }
};

fixInputBar('src/components/chat/InputBar.tsx');
