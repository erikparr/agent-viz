export interface ContentBlock {
  id: string;
  title: string;
  sections: { heading: string; items: string[] }[];
  closing?: string;
}

export const CONTENT_BLOCKS: Record<string, ContentBlock> = {
  skills: {
    id: "skills",
    title: "Skills & Capabilities",
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
