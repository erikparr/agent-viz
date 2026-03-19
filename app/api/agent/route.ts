import { DEMO_RUNS } from "@/lib/demoData";

export async function POST(req: Request) {
  var { query } = await req.json();

  // Find best matching demo run, or default to first
  var demo =
    DEMO_RUNS.find((d) =>
      d.query.toLowerCase().includes(query.toLowerCase().slice(0, 20))
    ) || DEMO_RUNS[0];

  var stream = new ReadableStream({
    async start(controller) {
      var encoder = new TextEncoder();

      for (var i = 0; i < demo.steps.length; i++) {
        var step = demo.steps[i];
        var delay = i === 0 ? 500 : step.timestamp - demo.steps[i - 1].timestamp;

        await new Promise((r) => setTimeout(r, Math.max(delay, 300)));

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(step)}\n\n`)
        );
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
