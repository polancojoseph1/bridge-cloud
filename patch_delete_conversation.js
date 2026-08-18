const fs = require('fs');
const file = 'src/components/sidebar/ConversationItem.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { memo } from 'react';",
  "import { memo, useState, useRef, useEffect } from 'react';"
);

content = content.replace(
  "import { Trash2 } from 'lucide-react';",
  "import { Trash2, Check } from 'lucide-react';"
);

// We'll just replace with git merge diff instead of full script replacement.
