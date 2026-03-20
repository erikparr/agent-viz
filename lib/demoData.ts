import type { AgentStep } from "./types";

export interface DemoRun {
  query: string;
  steps: AgentStep[];
}

export const DEMO_RUNS: DemoRun[] = [
  {
    query: "Explore Erik's project portfolio",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll search the portfolio database for all projects and their categories.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 800,
        code: `projects = search_portfolio("all projects")
print(f"Found {len(projects)} projects")`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 1200,
        toolCall: {
          name: "search_portfolio",
          arguments: { query: "all projects", include: "title, category, role" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2500,
        toolResult: {
          output: "Found 27 projects across categories: AI (8), Interactive (18), Exhibition/Museum (12), AR/VR (7), 3D (8), Artwork (7), Mechatronic (5). Projects span from installation art and physical computing to AI-native product design and agentic systems.",
          success: true,
        },
        projectRefs: ["intuitive", "foam", "agentic3d", "landscape", "extrasensory"],
      },
      {
        type: "thinking",
        stepNumber: 5,
        timestamp: 3200,
        thought: "Let me categorize the key projects by domain to give a structured overview.",
      },
      {
        type: "code",
        stepNumber: 6,
        timestamp: 4000,
        code: `categories = {
    "AI / Product": [
        "Intuitive Surgical — surgical video analytics prototypes",
        "FOAM — AI speech synthesis instrument (shipped product)",
        "Agentic 3D Environments — UX research",
        "Exquisite Landscape — generative AI art",
    ],
    "Interactive / 3D": [
        "AudioVisual WebGL Shader Experiments",
        "Interactive 3D Web Campaign",
        "Adidas AR Exhibition — permanent installation",
    ],
    "Installation / Art": [
        "Prague National Gallery — immersive projection",
        "Microsoft Cybercrime Center — botnet data viz",
        "ScreamOmeter — Norwegian Science Museum",
        "Study for Resonators — mechatronic sound sculpture",
    ],
}
for cat, items in categories.items():
    print(f"\\n{cat}:")
    for item in items:
        print(f"  - {item}")`,
        codeOutput: `
AI / Product:
  - Intuitive Surgical — surgical video analytics prototypes
  - FOAM — AI speech synthesis instrument (shipped product)
  - Agentic 3D Environments — UX research
  - Exquisite Landscape — generative AI art

Interactive / 3D:
  - AudioVisual WebGL Shader Experiments
  - Interactive 3D Web Campaign
  - Adidas AR Exhibition — permanent installation

Installation / Art:
  - Prague National Gallery — immersive projection
  - Microsoft Cybercrime Center — botnet data viz
  - ScreamOmeter — Norwegian Science Museum
  - Study for Resonators — mechatronic sound sculpture`,
      },
      {
        type: "final_answer",
        stepNumber: 7,
        timestamp: 6000,
        projectRefs: ["adidas", "shaders", "prague", "microsoft", "screamometer", "resonators"],
        finalAnswer: "Erik's portfolio spans 27 projects across AI product design, interactive experiences, and installation art.\n\nRecent AI/Product work includes advanced surgical video prototypes at Intuitive Surgical, FOAM (an AI speech-to-instrument product shipped commercially), and UX research into agentic 3D environments.\n\nInteractive work includes WebGL shader experiments, 3D web campaigns, and the permanent Adidas AR exhibition in Germany.\n\nInstallation and art projects include work at the Prague National Gallery, Microsoft Cybercrime Center (botnet data visualization), and mechatronic sound sculptures exhibited internationally.\n\nHe also founded Extrasensory, a digital product studio that shipped VEX MIDI Expression and FOAM — both used by music producers worldwide.",
      },
    ],
  },
  {
    query: "Show skills & capabilities overview",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll retrieve Erik's core capabilities and design philosophy from his portfolio profile.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 600,
        code: `profile = get_profile("skills, capabilities, philosophy")
print(profile)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 900,
        toolCall: {
          name: "get_profile",
          arguments: { sections: "skills, capabilities, philosophy" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2200,
        toolResult: {
          output: "Profile tagline: 'Building Agentic Systems for Interactive Products.' Four core capability areas: (1) Agentic Systems for Product Development — AI-augmented workflows, maintaining product vision through implementation, reducing handoff overhead. (2) Continuous Prototyping + User Testing — creative ideation, high-fidelity prototypes, rapid iteration, bridging design intent to shipped product. (3) Complex Tools & AI-Native Products — multi-panel data-dense interfaces, agentic/conversational UI, designing for uncertainty. (4) Bridge Design and Engineering — 10+ years full-stack, API/system architecture literacy, prototypes that become production code.",
          success: true,
        },
        contentRefs: ["skills"],
      },
      {
        type: "final_answer",
        stepNumber: 5,
        timestamp: 3500,
        finalAnswer: "Erik's capabilities center on four areas:\n\nAgentic Systems for Product Development — designing AI-augmented workflows that accelerate the design-to-production cycle while keeping product vision intact.\n\nContinuous Prototyping + User Testing — owning creative ideation, building high-fidelity prototypes that validate before production, and rapid iteration informed by user feedback.\n\nComplex Tools & AI-Native Products — interaction design for data-dense interfaces, agentic and conversational UI patterns, and designing for the uncertainty inherent in AI-driven workflows.\n\nBridge Design and Engineering — over 10 years as a full-stack engineer with API design and system architecture literacy. His prototypes become production code.\n\nHe works best embedded in product teams building complex tools or AI-native systems — specifically where the gap between design intent and shipped product is where things typically break.",
      },
    ],
  },
  {
    query: "How does Erik bridge design and engineering?",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "This is about his hybrid role — I need to find examples where design and engineering overlap in his work.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 700,
        code: `profile = get_profile("design engineering bridge")
projects = search_portfolio("design + engineering overlap")
print(profile, projects)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 1000,
        toolCall: {
          name: "search_portfolio",
          arguments: { query: "design engineering hybrid shipped production" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2200,
        toolResult: {
          output: "Profile states: 'product designer with deep software engineering fluency.' Key bridge evidence: (1) FOAM — designed the product AND built the full async pipeline (TTS, phoneme alignment, job queues, payments). Concept to launch in 3 weeks. (2) VEX — designed the UX AND wrote the C++/React hybrid architecture achieving sub-10ms latency. (3) Intuitive Surgical — sole design engineer, prototypes that link to production systems. (4) Design System case study — built bidirectional Figma-to-code pipeline in 1 day using Claude Code orchestration. (5) This portfolio site itself — an agentic interface he designed and built.",
          success: true,
        },
        projectRefs: ["foam", "extrasensory", "intuitive", "designsystem"],
      },
      {
        type: "thinking",
        stepNumber: 5,
        timestamp: 2800,
        thought: "The pattern is clear — he doesn't hand off designs to engineers. His prototypes become production code. Let me also check his infrastructure work.",
      },
      {
        type: "code",
        stepNumber: 6,
        timestamp: 3300,
        code: `infra = get_skills("systems, infrastructure, deployment")
print(infra)`,
      },
      {
        type: "tool_call",
        stepNumber: 7,
        timestamp: 3600,
        toolCall: {
          name: "get_skills",
          arguments: { category: "systems infrastructure" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 8,
        timestamp: 4400,
        toolResult: {
          output: "Systems skills: API design and multi-service orchestration, async job queues and event-driven architectures, CI/CD pipelines and cross-platform deployment, payment integration and webhook handlers. These aren't typical designer skills — they indicate someone who owns the full stack from pixel to production.",
          success: true,
        },
        contentRefs: ["skills"],
      },
      {
        type: "final_answer",
        stepNumber: 9,
        timestamp: 5500,
        finalAnswer: "Erik doesn't hand off designs to engineers — his prototypes become production code. This is the core of how he bridges the two disciplines:\n\nAt Intuitive Surgical, he's the sole design engineer on an advanced product team. He designs the interfaces AND builds the working prototypes that connect to real system data.\n\nWith FOAM, he designed the product concept and then personally built the entire backend: async TTS pipeline, forced phoneme alignment, job queues, Stripe webhooks, automated error recovery. Concept to shipped product in 3 weeks.\n\nFor VEX, he designed the UX and wrote the hybrid C++/React architecture that achieves sub-10ms audio latency with sample-accurate MIDI timing.\n\nHe built a full bidirectional design system pipeline (Figma to Next.js and back) in a single day using Claude Code as the orchestration layer.\n\nThe result: zero handoff overhead, no 'lost in translation' between design and implementation. He works best where that gap is usually where things break.",
      },
    ],
  },
  {
    query: "What is Erik's experience with AI and agentic systems?",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll search for AI-related projects and his stated focus areas around agentic systems.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 800,
        code: `ai_work = search_portfolio("AI agentic systems")
skills = get_skills("AI, agentic, machine learning")
print(ai_work, skills)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 1200,
        toolCall: {
          name: "search_portfolio",
          arguments: { query: "AI agentic systems machine learning" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2800,
        toolResult: {
          output: "Profile: 'Building Agentic Systems for Interactive Products.' Core focus areas: (1) Agentic Systems for Product Development — designing AI-augmented workflows for faster design-to-production cycles, (2) Complex Tools & AI-Native Products — interaction design for agentic and conversational UI patterns, designing for uncertainty and AI-driven workflows. AI projects: Intuitive Surgical (AI/ML prototypes for surgical video), Agentic 3D Environments (UX research into agents with visualization capabilities), FOAM (AI speech synthesis pipeline), Exquisite Landscape (LangChain + generative AI art), Design System Pipeline (Claude Code + Figma MCP orchestration).",
          success: true,
        },
        projectRefs: ["intuitive", "agentic3d", "foam", "landscape", "designsystem", "controlnet"],
      },
      {
        type: "thinking",
        stepNumber: 5,
        timestamp: 3500,
        thought: "His AI work spans from product design to hands-on engineering. Let me pull details on the agentic systems specifically.",
      },
      {
        type: "code",
        stepNumber: 6,
        timestamp: 4200,
        code: `details = get_project_details("agentic 3D environments")
print(details)`,
      },
      {
        type: "tool_call",
        stepNumber: 7,
        timestamp: 4500,
        toolCall: {
          name: "get_project_details",
          arguments: { project: "Agentic 3D Environments" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 8,
        timestamp: 5500,
        toolResult: {
          output: "UX Research: Agentic 3D Environments — Ongoing research into agentic UX where AI agents are natively equipped with visualization capabilities to communicate more effectively. Working prototype of an agent that can traverse and display user queries in a 3D mapped environment. Roles: UX Research, AI/ML, 3D Visualization.",
          success: true,
        },
      },
      {
        type: "final_answer",
        stepNumber: 9,
        timestamp: 7000,
        finalAnswer: "Erik's tagline is 'Building Agentic Systems for Interactive Products' — and his work backs it up across multiple dimensions:\n\nDesign strategy: He designs AI-augmented workflows that reduce the gap between design intent and shipped product, focusing on how to keep product vision intact through agentic tooling.\n\nHands-on AI engineering: At Intuitive Surgical, he prototypes AI/ML tools for surgical video analytics. He built FOAM's async pipeline using text-to-speech APIs with forced phoneme alignment. His Exquisite Landscape project uses LangChain + OpenAI for chained generative prompts with Stability AI inpainting.\n\nAgentic UX research: He's actively researching how AI agents can use 3D visualization as a native communication medium — with a working prototype where agents traverse and display queries in 3D space.\n\nDesign systems: He built a bidirectional design pipeline using Claude Code as the orchestration layer between Figma and production code.\n\nHis approach combines deep engineering fluency with product design — he doesn't just design for AI, he builds the agentic systems himself.",
      },
    ],
  },
  {
    query: "Tell me about Erik's exhibition and installation work",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll search for exhibition, museum, and installation projects.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 800,
        code: `exhibitions = search_portfolio("exhibition museum installation")
print(exhibitions)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 1100,
        toolCall: {
          name: "search_portfolio",
          arguments: { query: "exhibition museum installation artwork" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2500,
        toolResult: {
          output: "Found 12 exhibition/museum projects: Prague National Gallery (immersive projection mapping), Microsoft Cybercrime Center (permanent data visualization installation), ScreamOmeter at Norwegian Science Museum (sympathetic resonance game), Study for Resonators (50-unit mechatronic sound sculpture, Raflost Festival Iceland), Adidas AR Exhibition (permanent, HQ Germany), Microperception (Third Space Gallery Helsinki), Invisible Landscapes (nano-scale art), One Hundred Thousand Landscapes (generative sound installation), Technical commissions for artist Egill Saebjornsson (international exhibitions), Wonwei studio work for Olafur Arnalds world tour visuals.",
          success: true,
        },
        projectRefs: ["prague", "microsoft", "screamometer", "resonators", "adidas", "wonwei"],
      },
      {
        type: "thinking",
        stepNumber: 5,
        timestamp: 3200,
        thought: "This is a strong body of work spanning multiple countries and institutions. Let me organize by type.",
      },
      {
        type: "code",
        stepNumber: 6,
        timestamp: 3800,
        code: `permanent = ["Microsoft Cybercrime Center", "Adidas AR Exhibition (Germany)"]
museum = ["Prague National Gallery", "Norwegian Science Museum", "Third Space Gallery Helsinki"]
festival = ["Raflost Festival (Reykjavik)", "International art fairs"]
tour = ["Olafur Arnalds world tour (via Wonwei studio)"]
print("Permanent:", permanent)
print("Museum:", museum)
print("Festival:", festival)
print("Tour:", tour)`,
        codeOutput: `Permanent: ['Microsoft Cybercrime Center', 'Adidas AR Exhibition (Germany)']
Museum: ['Prague National Gallery', 'Norwegian Science Museum', 'Third Space Gallery Helsinki']
Festival: ['Raflost Festival (Reykjavik)', 'International art fairs']
Tour: ['Olafur Arnalds world tour (via Wonwei studio)']`,
      },
      {
        type: "final_answer",
        stepNumber: 7,
        timestamp: 5500,
        finalAnswer: "Erik has an extensive exhibition and installation practice spanning permanent installations, museums, festivals, and touring shows.\n\nPermanent installations include a data visualization piece at the Microsoft Cybercrime Center (mapping botnets from millions of infected computers) and the Adidas AR exhibition at their German headquarters.\n\nMuseum work includes immersive projection mapping at the Prague National Gallery, the ScreamOmeter at the Norwegian Science Museum (where visitors break wine glasses with their voice using sympathetic resonance), and laser-etched light compositions at Third Space Gallery in Helsinki.\n\nHe created Study for Resonators — 50 mechatronic structures forming an evolving polyrhythmic sound sculpture — commissioned by Raflost festival in Reykjavik.\n\nThrough Wonwei studio, he created real-time 3D concert visuals for Olafur Arnalds' world tour, using Kinect-driven reactive landscapes.\n\nHis installation work consistently bridges custom software, physical computing, and artistic vision.",
      },
    ],
  },
  {
    query: "What tech stack does Erik work with?",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll pull skills and technologies mentioned across all projects and his profile.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 600,
        code: `skills = get_skills("all")
print(skills)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 900,
        toolCall: {
          name: "get_skills",
          arguments: { category: "all" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2000,
        toolResult: {
          output: "Frontend: React, Next.js, Vue/Nuxt, TypeScript, Tailwind CSS, Three.js, WebGL/Shaders, Framer Motion. Backend: Node.js, Python, C++ (JUCE/openFrameworks). AI/ML: LangChain, OpenAI API, Stability AI, Claude API, Figma MCP. 3D/XR: Three.js, Unity3D, WebXR, ARKit, 8th Wall. Physical computing: Arduino, custom circuit design, mechatronics. Infrastructure: Vercel, Firebase, Railway, Stripe, CI/CD pipelines. Design: Figma, Tokens Studio, design systems, WCAG accessibility.",
          success: true,
        },
        contentRefs: ["techstack"],
      },
      {
        type: "final_answer",
        stepNumber: 5,
        timestamp: 3500,
        finalAnswer: "Erik works across a wide stack, reflecting his hybrid design-engineering role:\n\nFrontend: React, Next.js, Vue/Nuxt, TypeScript, Tailwind CSS, Three.js, WebGL shaders, Framer Motion\n\nBackend: Node.js, Python, C++ (JUCE for audio DSP, openFrameworks for generative graphics)\n\nAI/ML: LangChain, OpenAI API, Stability AI, Claude API/Claude Code, Figma MCP\n\n3D/XR: Three.js, Unity3D, WebXR, Apple ARKit, 8th Wall\n\nPhysical computing: Arduino, custom circuit design, mechatronics\n\nInfra: Vercel, Firebase, Railway, Stripe integration, CI/CD pipelines\n\nDesign tools: Figma, Tokens Studio, design system architecture, WCAG compliance\n\nHe's notable for shipping production code — not just prototypes. FOAM and VEX are commercial products, and his Intuitive Surgical work is production-facing.",
      },
    ],
  },
  {
    query: "Describe Erik's most recent work",
    steps: [
      {
        type: "thinking",
        stepNumber: 1,
        timestamp: 0,
        thought: "I'll look at the most recent projects in the portfolio — likely the ones listed first.",
      },
      {
        type: "code",
        stepNumber: 2,
        timestamp: 700,
        code: `recent = get_project_details("recent", limit=3)
print(recent)`,
      },
      {
        type: "tool_call",
        stepNumber: 3,
        timestamp: 1000,
        toolCall: {
          name: "get_project_details",
          arguments: { filter: "recent", limit: 3 },
        },
      },
      {
        type: "tool_result",
        stepNumber: 4,
        timestamp: 2200,
        toolResult: {
          output: "1. Intuitive Surgical — Design Technologist role. Sole design engineer embedded in advanced product design team, building prototypes for surgical video and analytics tools. Case-explorer concepts linking procedure video with system data and event timelines. Interfaces for automated post-case review. 2. Agentic 3D Environments — UX Research into agents with native 3D visualization capabilities. Working prototype. 3. Design System Case Study — Built bidirectional pipeline between Next.js codebase and Figma using Tokens Studio, Figma MCP, and Claude Code. Completed in 1 day.",
          success: true,
        },
        projectRefs: ["intuitive", "agentic3d", "designsystem"],
      },
      {
        type: "thinking",
        stepNumber: 5,
        timestamp: 2800,
        thought: "His recent work is heavily focused on AI-augmented design tooling and advanced prototyping. Let me also look at FOAM, his shipped product.",
      },
      {
        type: "code",
        stepNumber: 6,
        timestamp: 3300,
        code: `foam = get_project_details("FOAM")
print(foam)`,
      },
      {
        type: "tool_call",
        stepNumber: 7,
        timestamp: 3600,
        toolCall: {
          name: "get_project_details",
          arguments: { project: "FOAM" },
        },
      },
      {
        type: "tool_result",
        stepNumber: 8,
        timestamp: 4500,
        toolResult: {
          output: "FOAM — AI-powered creative product that makes synthesized speech playable. Transforms voice into phonetic elements via MIDI or step sequencer. Async pipeline with TTS APIs, forced phoneme alignment, webhook-based payments, and automated error recovery. Shipped and used by producers worldwide. Concept to launch in 3 weeks.",
          success: true,
        },
        projectRefs: ["foam"],
      },
      {
        type: "final_answer",
        stepNumber: 9,
        timestamp: 6000,
        finalAnswer: "Erik's most recent work centers on AI-augmented design and advanced prototyping:\n\nAt Intuitive Surgical, he's the sole design technologist embedded in an advanced product team, building future-facing prototypes for surgical video analytics — including case-explorer interfaces that link procedure video with system data and event timelines.\n\nHis Agentic 3D Environments research explores how AI agents can use 3D visualization as a native communication channel, with a working prototype demonstrating agents traversing user queries in mapped 3D space.\n\nFOAM, his shipped product at Extrasensory Studio, transforms AI-generated speech into playable instruments — built with an async pipeline using TTS, forced phoneme alignment, and webhook payments. Concept to production in 3 weeks.\n\nHe also completed a design system case study in a single day, building a full bidirectional pipeline between a production Next.js codebase and Figma using Claude Code as the orchestration layer.\n\nThe throughline: he's focused on where AI meets product design, building the actual tools and prototypes himself.",
      },
    ],
  },
];
