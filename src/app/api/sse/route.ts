import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      let counter = 0;

      const interval = setInterval(() => {
        counter++;

        const data = `data: ${JSON.stringify({ count: counter, time: new Date().toISOString() })}\n\n`;
        controller.enqueue(encoder.encode(data));

        if (counter >= 10) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);

      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
