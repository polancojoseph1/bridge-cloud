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
  const text = new TextDecoder().decode(totalBuffer);
  if (!text.trim()) return {};
  return JSON.parse(text);
}
