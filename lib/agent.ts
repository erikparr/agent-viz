import Anthropic from "@anthropic-ai/sdk";
import { toolDefinitions, executeTool } from "./tools";
import type { AgentStep } from "./types";

var SYSTEM_PROMPT = `You are a portfolio agent for Erik Parr, a Design Technologist with 15 years of experience building interactive systems end-to-end.

Your role is to answer questions about Erik's work, skills, projects, and experience. You have access to tools that search his portfolio database, retrieve project details, get his skills/capabilities, and access his resume.

Guidelines:
- Use tools to find relevant information before answering. Don't guess or make up information.
- Be concise and factual. Reference specific projects and roles.
- Keep tool calls focused — 1-3 tool calls is usually enough. Don't over-search.
- When you find relevant projects, mention them by name so the UI can display project cards.
- For skills or resume queries, use the appropriate tools so the UI can display structured content panels.
- Erik's tagline is "Building Agentic Systems for Interactive Products."
- He bridges design and engineering — his prototypes become production code.
- He's currently at Intuitive Surgical and runs Extrasensory Studio (shipped FOAM and VEX).
- Don't add information that isn't in the portfolio data. If you don't have the answer, say so.
- After gathering information, provide a clear final answer. Don't keep searching indefinitely.`;

var MAX_TURNS = 10;

export async function* runAgent(
  query: string
): AsyncGenerator<AgentStep> {
  var client = new Anthropic();
  var messages: Anthropic.MessageParam[] = [
    { role: "user", content: query },
  ];
  var stepNumber = 1;

  for (var turn = 0; turn < MAX_TURNS; turn++) {
    var response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      messages,
    });

    // Collect tool use blocks and their results for this turn
    var toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (var block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        // Strip any leaked XML tags from the response
        var cleanText = block.text
          .replace(/<function_results>[\s\S]*?<\/function_results>\s*/g, "")
          .replace(/<[a-z_]+>[\s\S]*?<\/[a-z_]+>\s*/g, "")
          .trim();

        if (!cleanText) continue;

        if (response.stop_reason === "end_turn") {
          yield {
            type: "final_answer",
            stepNumber: stepNumber++,
            timestamp: Date.now(),
            finalAnswer: cleanText,
          };
        } else {
          yield {
            type: "thinking",
            stepNumber: stepNumber++,
            timestamp: Date.now(),
            thought: cleanText,
          };
        }
      }

      if (block.type === "tool_use") {
        yield {
          type: "tool_call",
          stepNumber: stepNumber++,
          timestamp: Date.now(),
          toolCall: {
            name: block.name,
            arguments: block.input as Record<string, unknown>,
          },
        };

        var result = executeTool(block.name, block.input as Record<string, unknown>);

        yield {
          type: "tool_result",
          stepNumber: stepNumber++,
          timestamp: Date.now(),
          toolResult: {
            output: result.output,
            success: true,
          },
          projectRefs: result.projectRefs,
          contentRefs: result.contentRefs,
        };

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result.output,
        });
      }
    }

    // If there were tool calls, add assistant message + all tool results and continue
    if (toolResults.length > 0) {
      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    // No tool calls — we're done
    break;
  }
}
