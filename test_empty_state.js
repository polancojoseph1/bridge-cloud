const fs = require('fs');

const fixEmptyState = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      `import { Bot, ArrowUp } from 'lucide-react';\nimport { useChatStore } from '@/store/chatStore';\nimport { useRouter } from 'next/navigation';`,
      `import { Bot, ArrowUp } from 'lucide-react';\nimport { useChatStore } from '@/store/chatStore';\nimport { useOrchestrationStore } from '@/store/orchestrationStore';\nimport { useRouter } from 'next/navigation';`
    );
    content = content.replace(
      `  const router = useRouter();`,
      `  const router = useRouter();\n  const orchestrationMode = useOrchestrationStore(s => s.mode);`
    );
    content = content.replace(
      `  const handleSubmit = () => {\n    const trimmed = value.trim();\n    if (!trimmed || isStreaming) return;\n    setValue('');\n    if (textareaRef.current) textareaRef.current.style.height = 'auto';\n    startChat(trimmed);\n  };`,
      `  const handleSubmit = () => {\n    const trimmed = value.trim();\n    if (!trimmed || isStreaming) return;\n    if (orchestrationMode !== 'single') return;\n    setValue('');\n    if (textareaRef.current) textareaRef.current.style.height = 'auto';\n    startChat(trimmed);\n  };`
    );
    content = content.replace(
      `            placeholder="Message Bridge Cloud…"`,
      `            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud…" : "Orchestration modes coming soon!"}`
    );
    content = content.replace(
      `canSend\n                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'\n                  : 'bg-[#1e3025] cursor-not-allowed',`,
      `canSend && orchestrationMode === 'single'\n                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'\n                  : 'bg-[#1e3025] cursor-not-allowed',`
    );
    content = content.replace(
      `              disabled={!canSend}`,
      `              disabled={!canSend || orchestrationMode !== 'single'}`
    );
    fs.writeFileSync(file, content);
  }
};

fixEmptyState('src/components/chat/EmptyState.tsx');
