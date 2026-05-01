const fs = require('fs');
const file = 'src/store/chatStore.ts';
let code = fs.readFileSync(file, 'utf8');

const replace = `      deleteConversation: (id: string) => {
        // ⚡ Bolt: Replace multiple array traversals (.filter) with a single pass
        // to prevent O(N) memory allocations and reduce React GC pauses.
        const conversations = get().conversations;
        const convs: Conversation[] = [];
        let next: string | null = null;
        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i].id !== id) {
            convs.push(conversations[i]);
          }
        }
        if (convs.length > 0) {
          next = convs[0].id;
        }
        set({
          conversations: convs,
          activeConversationId: get().activeConversationId === id ? next : get().activeConversationId,
        });
      },`;

const search = `      deleteConversation: (id: string) => {
        const conversations = get().conversations;
        const convs: Conversation[] = [];
        let next: string | null = null;
        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i].id !== id) {
            convs.push(conversations[i]);
          }
        }
        if (convs.length > 0) {
          next = convs[0].id;
        }
        set({
          conversations: convs,
          activeConversationId: get().activeConversationId === id ? next : get().activeConversationId,
        });
      },`;

code = code.replace(search, replace);
fs.writeFileSync(file, code);
