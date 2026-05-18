const fs = require('fs');
let code = fs.readFileSync('src/components/chat/MessageList.tsx', 'utf8');

// Replace auto-scroll tracking using memory pattern
code = code.replace(
  /const isProgrammaticScrollRef = useRef\(false\);/,
  "const expectedScrollTop = useRef<number | null>(null);"
);

code = code.replace(
  /const scrollTimeoutRef = useRef<NodeJS\.Timeout \| null>\(null\);/,
  ""
);

code = code.replace(
  /    \/\/ If we recently programmatically scrolled, ignore this scroll event\n    if \(isProgrammaticScrollRef\.current\) {\n      \/\/ Don't clear it immediately because smooth scrolling fires multiple times\.\n      \/\/ The timeout below will clear it\.\n      return;\n    }/,
  "    // If we recently programmatically scrolled, ignore this scroll event\n    if (expectedScrollTop.current !== null && Math.abs(scrollRef.current.scrollTop - expectedScrollTop.current) <= 1) {\n      expectedScrollTop.current = null;\n      return;\n    }"
);

code = code.replace(
  /        isProgrammaticScrollRef\.current = true;\n        scrollRef\.current\.scrollTop = targetScrollTop;\n\n        if \(scrollTimeoutRef\.current\) clearTimeout\(scrollTimeoutRef\.current\);\n        scrollTimeoutRef\.current = setTimeout\(\(\) => {\n          isProgrammaticScrollRef\.current = false;\n        }, 150\); \/\/ 150ms covers most smooth scroll animations/g,
  "        expectedScrollTop.current = targetScrollTop;\n        scrollRef.current.scrollTop = targetScrollTop;"
);

code = code.replace(
  /        isProgrammaticScrollRef\.current = true;\n        scrollRef\.current\.scrollTop = targetScrollTop;\n\n        if \(scrollTimeoutRef\.current\) clearTimeout\(scrollTimeoutRef\.current\);\n        scrollTimeoutRef\.current = setTimeout\(\(\) => {\n          isProgrammaticScrollRef\.current = false;\n        }, 150\);/g,
  "        expectedScrollTop.current = targetScrollTop;\n        scrollRef.current.scrollTop = targetScrollTop;"
);

code = code.replace(
  /      onWheel=\{.*?\}\n      onTouchMove=\{.*?\}\n      onPointerDown=\{.*?\}/s,
  "      onWheel={() => { expectedScrollTop.current = null; }}\n      onTouchMove={() => { expectedScrollTop.current = null; }}\n      onPointerDown={() => { expectedScrollTop.current = null; }}"
);

fs.writeFileSync('src/components/chat/MessageList.tsx', code);
