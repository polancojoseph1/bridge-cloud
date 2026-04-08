export async function streamFromProxy(
  agentId: string,
  message: string,
  conversationId: string,
  onChunk: (chunk: string) => void,
  onProgress?: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  // Get active server profile from store (client-side only)
  const { useServerStore } = await import('@/store/serverStore');
  const profile = useServerStore.getState().activeProfile();

  const res = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId,
      message,
      conversationId,
      serverUrl: profile?.url ?? '',
      serverKey: profile?.apiKey ?? '',
    }),
    signal,
    redirect: 'error',
  });

  if (!res.ok || !res.body) {
    throw new Error(`Proxy error: ${res.status}`);
  }

  const reader = res.body.getReader();
  if (signal) {
    signal.addEventListener('abort', () => {
      reader.cancel().catch(() => {});
    }, { once: true });
  }
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    if (signal?.aborted) {
      const error = new Error('Aborted');
      error.name = 'AbortError';
      throw error;
    }

    const { done, value } = await reader.read();

    if (signal?.aborted) {
      const error = new Error('Aborted');
      error.name = 'AbortError';
      throw error;
    }
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const event = JSON.parse(trimmed);
        if (event.type === 'delta' && event.text) {
          onChunk(event.text);
        } else if (event.type === 'progress' && event.text && onProgress) {
          onProgress(event.text);
        } else if (event.type === 'error') {
          throw new Error(event.message ?? 'Stream error');
        } else if (event.type === 'done') {
          return;
        }
      } catch (parseErr) {
        if (!(parseErr instanceof SyntaxError)) {
          throw parseErr;
        }
        // Non-JSON line — ignore (could be SSE comment or empty)
      }
    }
  }
}
