import type { AgentStep } from "./types";

export interface DemoRun {
  query: string;
  steps: AgentStep[];
}

export const DEMO_RUNS: DemoRun[] = [
  {
    query: "Compare the AI strategies of Apple and Google",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought:
          "I need to research the current AI strategies of both Apple and Google. Let me start by searching for recent information about each company's approach to AI.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 1500,
        code: `apple_results = web_search("Apple AI strategy 2024 2025")
print(apple_results)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 2000,
        toolCall: {
          name: "web_search",
          arguments: { query: "Apple AI strategy 2024 2025" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 4500,
        toolResult: {
          output:
            "Apple Intelligence: Apple's on-device AI approach focuses on privacy-first ML models running locally on Apple Silicon. Key features include system-wide writing tools, image generation (Image Playground), and Siri improvements with LLM integration. Partnership with OpenAI for complex queries via Private Cloud Compute.",
          success: true,
        },
      },
      {
        type: "code",
        stepNumber: 5,
        timestamp: 5500,
        code: `google_results = web_search("Google AI strategy Gemini 2024 2025")
print(google_results)`,
      },
      {
        type: "tool_call",
        stepNumber: 6,
        timestamp: 6000,
        toolCall: {
          name: "web_search",
          arguments: { query: "Google AI strategy Gemini 2024 2025" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 7,
        timestamp: 8500,
        toolResult: {
          output:
            "Google's AI strategy centers on Gemini, its multimodal foundation model family. Cloud-first approach with AI integrated across Search, Workspace, Android. DeepMind merger accelerated research. Gemini Ultra, Pro, and Nano models target different use cases. Heavy investment in AI infrastructure (TPU v5, custom chips).",
          success: true,
        },
      },
      {
        type: "thinking",
        stepNumber: 8,
        timestamp: 9500,
        thought:
          "Now I have data on both companies. Let me synthesize a comparison across key dimensions: approach (on-device vs cloud), privacy stance, model strategy, and ecosystem integration.",
      },
      {
        type: "code",
        stepNumber: 9,
        timestamp: 11000,
        code: `comparison = {
    "Apple": {
        "approach": "On-device first, privacy-centric",
        "models": "Apple Foundation Models + OpenAI partnership",
        "focus": "User experience, seamless integration",
        "infrastructure": "Apple Silicon (M-series, A-series chips)"
    },
    "Google": {
        "approach": "Cloud-first, multimodal",
        "models": "Gemini family (Ultra/Pro/Nano)",
        "focus": "Search, productivity, developer platform",
        "infrastructure": "TPUs, custom AI accelerators"
    }
}

for company, details in comparison.items():
    print(f"\\n{company}:")
    for key, value in details.items():
        print(f"  {key}: {value}")`,
        codeOutput: `
Apple:
  approach: On-device first, privacy-centric
  models: Apple Foundation Models + OpenAI partnership
  focus: User experience, seamless integration
  infrastructure: Apple Silicon (M-series, A-series chips)

Google:
  approach: Cloud-first, multimodal
  models: Gemini family (Ultra/Pro/Nano)
  focus: Search, productivity, developer platform
  infrastructure: TPUs, custom AI accelerators`,
      },
      {
        type: "final_answer",
        stepNumber: 10,
        timestamp: 13000,
        finalAnswer:
          "Apple and Google have fundamentally different AI strategies:\n\n**Apple** prioritizes on-device processing and privacy. Their Apple Intelligence runs ML models locally on Apple Silicon, with a partnership with OpenAI for complex queries routed through Private Cloud Compute. The focus is on seamless UX integration.\n\n**Google** takes a cloud-first, multimodal approach with the Gemini model family. They invest heavily in AI infrastructure (TPUs) and integrate AI across Search, Workspace, and Android. Their strategy is more platform/developer oriented.\n\nKey difference: Apple treats AI as an invisible UX layer; Google treats AI as the core product.",
      },
    ],
  },
  {
    query: "What are the top 3 most populated cities in Europe?",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll search for current population data for European cities.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 1200,
        code: `results = web_search("most populated cities in Europe 2024 population")
print(results)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 1500,
        toolCall: {
          name: "web_search",
          arguments: { query: "most populated cities in Europe 2024 population" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 3500,
        toolResult: {
          output:
            "Top European cities by population (city proper): 1. Istanbul - 15.8 million (transcontinental), 2. Moscow - 13.1 million, 3. London - 9.0 million, 4. Saint Petersburg - 5.6 million, 5. Berlin - 3.7 million",
          success: true,
        },
      },
      {
        type: "code",
        stepNumber: 5,
        timestamp: 4500,
        code: `cities = [
    ("Istanbul", 15.8, "Turkey (transcontinental)"),
    ("Moscow", 13.1, "Russia"),
    ("London", 9.0, "United Kingdom"),
]

print("Top 3 Most Populated Cities in Europe:")
for i, (city, pop, country) in enumerate(cities, 1):
    print(f"  {i}. {city}, {country} — {pop}M")`,
        codeOutput: `Top 3 Most Populated Cities in Europe:
  1. Istanbul, Turkey (transcontinental) — 15.8M
  2. Moscow, Russia — 13.1M
  3. London, United Kingdom — 9.0M`,
      },
      {
        type: "final_answer",
        stepNumber: 6,
        timestamp: 6000,
        finalAnswer:
          "The top 3 most populated cities in Europe (city proper):\n\n1. **Istanbul, Turkey** — 15.8 million (note: transcontinental city spanning Europe and Asia)\n2. **Moscow, Russia** — 13.1 million\n3. **London, United Kingdom** — 9.0 million",
      },
    ],
  },
];
