export interface ContentSection {
  heading: string;
  items: string[];
}

export interface ContentTab {
  label: string;
  sections: ContentSection[];
}

export interface ContentBlock {
  id: string;
  title: string;
  tabs?: ContentTab[];
  sections?: ContentSection[];
  closing?: string;
}

export const CONTENT_BLOCKS: Record<string, ContentBlock> = {
  skills: {
    id: "skills",
    title: "Skills & Capabilities",
    tabs: [
      {
        label: "Design & Product",
        sections: [
          {
            heading: "Agentic Systems for Product Development",
            items: [
              "Designing AI-augmented workflows for faster design-to-production cycles",
              "Experimenting with how to keep product vision intact through implementation",
              "Building tooling that reduces phase transitions and handoff overhead",
            ],
          },
          {
            heading: "Continuous Prototyping + User Testing",
            items: [
              "Owning creative ideation based on product needs",
              "High-fidelity prototypes that validate before committing to production",
              "Rapid iteration cycles informed by user feedback",
              "Bridging the gap between design intent and shipped product",
            ],
          },
          {
            heading: "Complex Tools & AI-Native Products",
            items: [
              "Interaction design for multi-panel layouts and data-dense interfaces",
              "Agentic and conversational UI patterns",
              "Designing for uncertainty and AI-driven workflows",
            ],
          },
          {
            heading: "Bridge Design and Engineering",
            items: [
              "Full-stack engineer with over 10 years experience",
              "API design and system architecture literacy",
              "Prototypes that become production code",
            ],
          },
        ],
      },
      {
        label: "Engineering",
        sections: [
          {
            heading: "Interaction & UX Engineering",
            items: [
              "Interaction architecture for complex tools and workflows",
              "UI design for dashboards, timelines, and multi-panel layouts",
              "Rapid prototyping for UX research and stakeholder demos",
            ],
          },
          {
            heading: "Front-End & Interface Engineering",
            items: [
              "TypeScript / JavaScript",
              "Vue, React and component-based architectures",
              "Three.js / WebGL, Canvas, rendering and performance optimization",
            ],
          },
          {
            heading: "Systems & Production Infrastructure",
            items: [
              "API design and multi-service orchestration",
              "Async job queues and event-driven architectures",
              "CI/CD pipelines and cross-platform deployment",
              "Payment integration and webhook handlers",
            ],
          },
        ],
      },
      {
        label: "Data & AI",
        sections: [
          {
            heading: "Data, AI & Visualization",
            items: [
              "Data visualization for complex datasets and analytics",
              "Real-time data pipelines and streaming interfaces",
              "AI/ML integration with production-ready error handling",
            ],
          },
          {
            heading: "AI Tooling & Agents",
            items: [
              "LangChain, OpenAI API, Stability AI",
              "Claude API, Claude Code, Figma MCP",
              "Apple Core ML, ControlNet, Stable Diffusion",
              "Agentic orchestration and multi-step reasoning pipelines",
            ],
          },
        ],
      },
    ],
    closing:
      "I work best embedded in product teams building complex tools, AI-native systems, or anything where the gap between design intent and shipped product is usually where things break.",
  },
  techstack: {
    id: "techstack",
    title: "Tech Stack",
    sections: [
      {
        heading: "Frontend",
        items: [
          "React, Next.js, Vue/Nuxt, TypeScript",
          "Tailwind CSS, Framer Motion",
          "Three.js, WebGL, GLSL Shaders",
        ],
      },
      {
        heading: "Backend & Systems",
        items: [
          "Node.js, Python",
          "C++ (JUCE for audio DSP, openFrameworks for generative graphics)",
          "Firebase, Railway, Vercel",
        ],
      },
      {
        heading: "AI / ML",
        items: [
          "LangChain, OpenAI API, Stability AI",
          "Claude API, Claude Code, Figma MCP",
          "Apple Core ML, ControlNet, Stable Diffusion",
        ],
      },
      {
        heading: "3D / XR",
        items: [
          "Three.js, Unity3D, WebXR",
          "Apple ARKit, 8th Wall",
          "DRACO compression, GLB/GLTF pipelines",
        ],
      },
      {
        heading: "Physical Computing",
        items: [
          "Arduino, custom circuit design",
          "Mechatronics, sensor systems",
          "Projection mapping, laser fabrication",
        ],
      },
      {
        heading: "Design",
        items: [
          "Figma, Tokens Studio, design system architecture",
          "WCAG accessibility compliance",
          "Stripe integration, CI/CD pipelines",
        ],
      },
    ],
  },
};
