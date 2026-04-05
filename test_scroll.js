const fs = require('fs');
const content = fs.readFileSync('src/components/chat/MessageList.tsx', 'utf-8');
console.log(content.includes('messages.length > prevCountRef.current'));
