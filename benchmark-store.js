import { createStore } from 'zustand/vanilla';

const storeUnoptimized = createStore((set) => ({
  conversations: [{ id: '1', messages: [{ id: 'm1', content: '' }] }],
  onChunk: (chunk) => set((s) => ({
    conversations: s.conversations.map(c =>
      c.id === '1'
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === 'm1' ? { ...m, content: m.content + chunk } : m
            )
          }
        : c
    )
  }))
}));

const storeOptimized = createStore((set) => {
  let pendingContent = '';
  let flushTimeout = null;

  const flush = () => {
    if (!pendingContent) return;
    const chunkToApply = pendingContent;
    pendingContent = '';
    set((s) => ({
      conversations: s.conversations.map(c =>
        c.id === '1'
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === 'm1' ? { ...m, content: m.content + chunkToApply } : m
              )
            }
          : c
      )
    }));
  };

  return {
    conversations: [{ id: '1', messages: [{ id: 'm1', content: '' }] }],
    onChunk: (chunk) => {
      pendingContent += chunk;
      if (!flushTimeout) {
        flushTimeout = setTimeout(() => {
          flushTimeout = null;
          flush();
        }, 16);
      }
    },
    flush
  };
});

async function run() {
  const chunks = Array(10000).fill('a');

  const start1 = performance.now();
  for (const c of chunks) {
    storeUnoptimized.getState().onChunk(c);
  }
  const end1 = performance.now();

  const start2 = performance.now();
  for (const c of chunks) {
    storeOptimized.getState().onChunk(c);
  }
  storeOptimized.getState().flush(); // ensure it finishes
  const end2 = performance.now();

  console.log(`Unoptimized: ${end1 - start1} ms`);
  console.log(`Optimized: ${end2 - start2} ms`);
}

run();
