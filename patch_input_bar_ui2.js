const fs = require('fs');

const fixInputBar = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      `placeholder="Message Bridge Cloud…"`,
      `placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud…" : "Orchestration modes coming soon!"}`
    );
    // Let's also patch the Send button click handler if it's not disabled.
    content = content.replace(
      `canSend\n                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'\n                  : 'bg-[#1e3025] cursor-not-allowed',`,
      `canSend && orchestrationMode === 'single'\n                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'\n                  : 'bg-[#1e3025] cursor-not-allowed',`
    );
    fs.writeFileSync(file, content);
  }
};

fixInputBar('src/components/chat/InputBar.tsx');
