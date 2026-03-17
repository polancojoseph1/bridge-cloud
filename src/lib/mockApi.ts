export async function streamMockResponse(
  message: string,
  agentId: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const agentName = agentId === 'claude' ? 'Claude' : agentId === 'gemini' ? 'Gemini' : agentId === 'codex' ? 'Codex' : agentId === 'qwen' ? 'Qwen' : 'Free Bot';
  const responses = [
    `I'm ${agentName}, your AI assistant. You asked: "${message}". Here's my response with some helpful information and context to demonstrate the streaming effect working properly.`,
    `That's a great question! Let me think about "${message}" carefully. The answer involves several key considerations that I'll walk through step by step for you.`,
    `Sure! Regarding "${message}" — here are the main points to consider. First, let's establish the context. Then we can dive into the details together.`,
  ];
  const text = responses[Math.floor(Math.random() * responses.length)];
  for (let i = 0; i < text.length; ) {
    const chunkSize = Math.ceil(Math.random() * 3 + 1);
    await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
    onChunk(text.slice(i, i + chunkSize));
    i += chunkSize;
  }
}
