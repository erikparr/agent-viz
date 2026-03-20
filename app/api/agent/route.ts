import { DEMO_RUNS } from "@/lib/demoData";
import { runAgent } from "@/lib/agent";

var SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

function streamDemoRun(query: string) {
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
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(step)}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}

function streamAgentRun(query: string) {
  var stream = new ReadableStream({
    async start(controller) {
      var encoder = new TextEncoder();
      try {
        for await (var step of runAgent(query)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(step)}\n\n`));
        }
      } catch (err) {
        var errorStep = {
          type: "error",
          stepNumber: 0,
          timestamp: Date.now(),
          thought: err instanceof Error ? err.message : "Agent error",
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorStep)}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}

export async function POST(req: Request) {
  var { query, isPreset } = await req.json();

  // Presets always use fast demo data
  if (isPreset) {
    return streamDemoRun(query);
  }

  // Typed queries use real agent if API key available, else demo fallback
  if (!process.env.ANTHROPIC_API_KEY) {
    return streamDemoRun(query);
  }

  return streamAgentRun(query);
}
