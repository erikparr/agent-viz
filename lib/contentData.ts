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
  resume: {
    id: "resume",
    title: "Resume",
    tabs: [
      {
        label: "Experience",
        sections: [
          {
            heading: "Intuitive Surgical — 2025 – Present",
            items: [
              "Design Technologist, Advanced Product Design (Contract)",
              "Sole design technologist building production-quality prototypes for surgical video and data tools",
              "Designed and engineered AI-powered case summarization using local LLM integration",
              "Built 3D visualization tools for robotic tool path analysis using Three.js",
              "Translated complex clinical workflows into multi-panel interfaces with linked video/data timelines",
            ],
          },
          {
            heading: "Extrasensory Studio — 2024 – Present",
            items: [
              "Founder / Design Technologist",
              "Shipped FOAM: full stack from C++/JUCE engine to React UI, Python backend, e-commerce",
              "Built async processing pipeline: TTS APIs, job queues, webhook payments, error recovery",
            ],
          },
          {
            heading: "Indigo Slate — 2023 – 2025",
            items: [
              "Senior Design Technologist",
              "Led systems design and frontend architecture for interactive tools and product experiences",
              "Built shared component libraries and design system tooling across multiple projects",
              "Drove R&D around AI-enhanced interfaces and real-time visualization",
            ],
          },
          {
            heading: "Valtech — 2019 – 2023",
            items: [
              "Senior Design Technologist / Software Engineer",
              "Architected frontend systems and interaction layers for product tools and enterprise apps",
              "Built tools enabling designers to control real-time parameters without engineering support",
            ],
          },
          {
            heading: "Kram/Weisshaar — 2017 – 2018",
            items: [
              "Senior Design Technologist",
              "Interactive systems and real-time visualization at the intersection of software and physical product",
            ],
          },
          {
            heading: "Studio Erik Parr — 2012 – 2022",
            items: [
              "Principal Design Technologist",
              "End-to-end product design and engineering for interactive tools, data visualizations, generative systems",
            ],
          },
          {
            heading: "Earlier Roles",
            items: [
              "The Office for Creative Research (2014) — Interactive data visualization tools",
              "Gagarin Interactive (2017) — Museum and exhibition systems",
              "Wonwei (2012–2013) — Lead Creative, Olafur Arnalds world tour visuals",
              "Icelandic Institute for Intelligent Machines (2009–2011) — 3D/VR for AI research",
            ],
          },
        ],
      },
      {
        label: "Education",
        sections: [
          {
            heading: "Degrees",
            items: [
              "MA, Visual Culture and Contemporary Art Production — Aalto School of Arts, Design and Architecture, Helsinki (2016)",
              "BFA, Digital Arts and Experimental Media (DXARTS) — University of Washington (2009)",
              "BA, Comparative History of Ideas — University of Washington (2009)",
            ],
          },
          {
            heading: "Residencies",
            items: [
              "Schloss Artist Residency, Germany (2021)",
              "EMS Stockholm (2017)",
              "A-DASH Athens (2017)",
              "HIAP Finnish Archipelago (2015)",
              "CADIA AI Lab, Iceland (2010)",
            ],
          },
          {
            heading: "Grants",
            items: [
              "Kone Foundation Art Grant, Finland (2016)",
              "Alt-w New Media Scotland (2013)",
            ],
          },
        ],
      },
      {
        label: "Recognition",
        sections: [
          {
            heading: "Shipped Products",
            items: [
              "FOAM audio instrument (commercial product)",
              "AI-powered surgical case review system (Intuitive Surgical)",
            ],
          },
          {
            heading: "Permanent Installations",
            items: [
              "Microsoft Cybercrime Center, Seattle (2014)",
              "Adidas AR Exhibition, Germany",
            ],
          },
          {
            heading: "Selected Exhibitions",
            items: [
              "Barbican Center London w/ Olafur Arnalds (2013)",
              "Reykjavik Art Museum (2011)",
              "Center of Contemporary Art Glasgow (2013)",
              "Henry Art Gallery Seattle (2008)",
            ],
          },
        ],
      },
    ],
    closing: "15 years building interactive systems end-to-end, from prototype through production.",
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
