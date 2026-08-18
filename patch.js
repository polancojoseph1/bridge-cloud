const fs = require('fs');
let content = fs.readFileSync('src/components/sidebar/ConversationItem.tsx', 'utf8');

content = content.replace(
  "import { memo } from 'react';",
  "import { memo, useState, useRef, useEffect } from 'react';"
);

content = content.replace(
  "import { Trash2 } from 'lucide-react';",
  "import { Trash2, Check } from 'lucide-react';"
);

content = content.replace(
  "  const deleteConversation = useChatStore((s) => s.deleteConversation);",
  `  const deleteConversation = useChatStore((s) => s.deleteConversation);

  const [isConfirming, setIsConfirming] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);`
);

content = content.replace(
  `  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteConversation(conversation.id);
  }`,
  `  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (isConfirming) {
      deleteConversation(conversation.id);
    } else {
      setIsConfirming(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsConfirming(false), 3000);
    }
  }

  function handleMouseLeave() {
    if (isConfirming) {
      setIsConfirming(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }`
);

content = content.replace(
  `      className={cn(`,
  `      onMouseLeave={handleMouseLeave}
      className={cn(`
);

content = content.replace(
  `      {/* Delete button — hidden until group hover */}
      <button
        onClick={handleDelete}
        aria-label="Delete conversation"
        title="Delete conversation"
        className={cn(
          'flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100',
          'text-[#5c5c5c] hover:text-[#e05c5c]',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-[#6c8cff]'
        )}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>`,
  `      {/* Delete button — inline confirmation state */}
      <button
        onClick={handleDelete}
        aria-label={isConfirming ? "Confirm delete conversation" : "Delete conversation"}
        title={isConfirming ? "Confirm delete conversation" : "Delete conversation"}
        className={cn(
          'flex-shrink-0 p-1 rounded transition-all duration-150',
          'focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-[#6c8cff]',
          isConfirming
            ? 'opacity-100 text-[#e05c5c] hover:bg-[#e05c5c]/10'
            : 'opacity-0 group-hover:opacity-100 text-[#5c5c5c] hover:text-[#e05c5c]'
        )}
      >
        {isConfirming ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>`
);

fs.writeFileSync('src/components/sidebar/ConversationItem.tsx', content);
