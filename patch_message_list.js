const fs = require('fs');

const fixMessageList = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      `      onTouchMove={() => { isProgrammaticScrollRef.current = false; }}`,
      `      onTouchMove={() => { isProgrammaticScrollRef.current = false; }}\n      onPointerDown={() => { isProgrammaticScrollRef.current = false; }}`
    );
    fs.writeFileSync(file, content);
  }
};

fixMessageList('src/components/chat/MessageList.tsx');
