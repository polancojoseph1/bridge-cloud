/**
 * ⚡ Bolt Optimization: Hoisted TextDecoder
 * 💡 What: Moved TextDecoder instantiation to the module scope.
 * 🎯 Why: TextDecoder (without { stream: true }) is stateless. Reusing a single instance avoids
 *         allocating a new object on every request, reducing GC pressure in this hot path.
 * 📊 Impact: Decreased CPU overhead and garbage collection pauses during high-throughput JSON parsing.
 */
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
