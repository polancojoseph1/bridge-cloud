const fs = require('fs');

const file = 'src/components/server/ServerManageModal.tsx';
const content = fs.readFileSync(file, 'utf8');

const regex = /<button[\s\S]*?<\/button>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const btn = match[0];
  if (!btn.includes('aria-label') && !btn.includes('title')) {
    console.log(btn);
    console.log('-----');
  }
}
