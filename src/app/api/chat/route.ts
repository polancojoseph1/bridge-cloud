import { NextRequest } from 'next/server';
import { streamMockResponse } from '@/lib/mockApi';
import { auth } from '@clerk/nextjs/server';
import { parseJsonBodyWithLimit } from '@/lib/bodyParser';

export async function POST(req: NextRequest) {
  // 🛡️ Sentinel: Close unauthenticated open proxy by requiring login
  const { userId } = await auth();
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Authentication required to use proxy' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 🛡️ Sentinel: Mitigate DoS by enforcing a strict total request body size limit
  let body;
  try {
    body = await parseJsonBodyWithLimit(req, 50000);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Request body too large or invalid' }),
      { status: 413, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { message, agentId } = body;

  // 🛡️ Sentinel: Mitigate DoS by restricting message length and input validation
  if (!message || typeof message !== 'string' || message.length > 20000) {
    return new Response(
      JSON.stringify({ error: 'Message is required and must be under 20000 characters' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

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
