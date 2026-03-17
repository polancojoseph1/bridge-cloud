import { streamMockResponse } from '@/lib/mockApi';

export async function POST(req: Request) {
  const { message, agentId } = await req.json();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      await streamMockResponse(message, agentId, (chunk) => {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
      });
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
