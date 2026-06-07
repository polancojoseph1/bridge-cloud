// ⚡ Bolt Optimization: Reuse stateless TextDecoder globally
// 💡 What: Replaced per-request TextDecoder instantiation with a module-scoped instance.
// 🎯 Why: When not using { stream: true }, TextDecoder is stateless. Reusing it prevents redundant object allocation and garbage collection overhead on every parsed JSON payload.
// 📊 Impact: Eliminates TextDecoder allocation per request, reducing GC pauses.
const textDecoder = new TextDecoder();

export async function parseJsonBodyWithLimit(body: ReadableStream<Uint8Array> | null, limit: number) {
  if (!body) return {};
  const reader = body.getReader();
  let bytesRead = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      bytesRead += value.length;
      if (bytesRead > limit) {
        reader.cancel();
        throw new Error('Payload too large');
      }
      chunks.push(value);
    }
  }
  const totalBuffer = new Uint8Array(bytesRead);
  let offset = 0;
  for (const chunk of chunks) {
    totalBuffer.set(chunk, offset);
    offset += chunk.length;
  }
  const text = textDecoder.decode(totalBuffer);
  if (!text.trim()) return {};
  return JSON.parse(text);
}
