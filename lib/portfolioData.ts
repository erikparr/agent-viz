export interface Project {
  id: string;
  title: string;
  description: string;
  roles: string[];
  categories: string[];
  image: string;
  link?: string;
}

export const PROJECTS: Record<string, Project> = {
  intuitive: {
    id: "intuitive",
    title: "Intuitive Surgical",
    description: "Designing and engineering advanced prototypes for future surgical video and analytics tools. Sole design engineer embedded in an advanced product design team, building case-explorer concepts that link procedure video with system data and event timelines.",
    roles: ["Design Technologist", "Data Visualization", "AI/ML"],
    categories: ["AI", "Interactive"],
    image: "/images/intuitive.png",
  },
  agentic3d: {
    id: "agentic3d",
    title: "Agentic 3D Environments",
    description: "Ongoing UX research into agentic systems where AI agents are natively equipped with 3D visualization capabilities. Working prototype of an agent that traverses and displays user queries in a mapped 3D environment.",
    roles: ["UX Research", "AI/ML", "3D Visualization"],
    categories: ["AI", "3D", "Interactive"],
    image: "/images/omnitope.png",
    link: "https://omnitope-viewer-o4wbtktqi-erik-parrs-projects.vercel.app",
  },
  designsystem: {
    id: "designsystem",
    title: "Design System Pipeline",
    description: "Built a full bidirectional pipeline between a production Next.js codebase and Figma using Tokens Studio, Figma MCP, and Claude Code as the orchestration layer. Completed in a single day.",
    roles: ["Design Engineer"],
    categories: ["AI", "Interactive"],
    image: "/images/design-system-hero.png",
  },
  foam: {
    id: "foam",
    title: "FOAM",
    description: "AI-powered creative product that makes synthesized speech playable. Transforms voice into phonetic elements — stutters, glitch consonants, vowel textures — via MIDI or step sequencer. Async pipeline with TTS, forced phoneme alignment, and webhook-based payments. Shipped and used by producers worldwide.",
    roles: ["Design", "Development", "Product"],
    categories: ["AI", "Interactive"],
    image: "/images/vex.png",
    link: "https://www.extrasensory.studio/foam",
  },
  extrasensory: {
    id: "extrasensory",
    title: "Extrasensory Studio",
    description: "Founded a digital product studio. First product: VEX MIDI Expression — cross-platform audio plugin using real-time physics simulation. Hybrid JUCE C++ / React architecture achieving sub-10ms latency. Automated CI/CD for macOS/Windows/Linux distribution.",
    roles: ["Founder", "Product Design", "Full-Stack Development"],
    categories: ["Interactive", "AI"],
    image: "/images/vex.png",
    link: "https://www.extrasensory.studio",
  },
  shaders: {
    id: "shaders",
    title: "AudioVisual Shader Experiments",
    description: "Spectral audio data visualized with advanced WebGL shaders and audio-reactive 3D deformations. R&D project for Indigo Slate.",
    roles: ["Three.js", "WebGL", "Shaders", "Audio"],
    categories: ["3D", "Interactive"],
    image: "/images/shader001.gif",
  },
  prague: {
    id: "prague",
    title: "Prague National Gallery",
    description: "Immersive environment for projection mapping and custom generative software for visual artist Egill Saebjornsson at the Prague National Gallery.",
    roles: ["Lead Developer", "Creative Technologist", "Unity3D"],
    categories: ["Interactive", "Exhibition/Museum", "Artwork"],
    image: "/images/prague.png",
  },
  microsoft: {
    id: "microsoft",
    title: "Microsoft Cybercrime Center",
    description: "Permanent installation mapping and visualizing botnets from millions of infected computers. Interactive application allowing data to be explored visually and sonically. Created at The Office for Creative Research.",
    roles: ["Software Development", "Creative Technology", "Data Art"],
    categories: ["Interactive", "Exhibition/Museum"],
    image: "/images/ocr.gif",
  },
  screamometer: {
    id: "screamometer",
    title: "ScreamOmeter",
    description: "Installation at the Norwegian Science Museum where visitors break a wine glass using only their voice. Custom system incorporating architecture, software, and physical computing to demonstrate sympathetic resonance.",
    roles: ["Technical Direction", "Creative Technology"],
    categories: ["Interactive", "Exhibition/Museum", "Mechatronic"],
    image: "/images/screamometer.png",
  },
  resonators: {
    id: "resonators",
    title: "Study for Resonators",
    description: "Fifty resonating structures create an evolving polyrhythmic installation transforming gallery space into living sound sculpture. Custom software and physical computing activate custom-designed instruments. Commissioned by Raflost festival, Reykjavik.",
    roles: ["Art Direction", "Software Development", "Circuit Design"],
    categories: ["Interactive", "Exhibition/Museum", "Mechatronic"],
    image: "/images/resonators.png",
  },
  wonwei: {
    id: "wonwei",
    title: "Wonwei — Olafur Arnalds Tour",
    description: "Real-time immersive 3D visual show for Olafur Arnalds' world tour. Software landscapes responding to live music and performer movement via Kinect camera. Art Director and Technical Lead at Wonwei studio.",
    roles: ["Art Direction", "Technical Direction", "Software Dev"],
    categories: ["Interactive", "Exhibition/Museum"],
    image: "/images/oli.png",
  },
  landscape: {
    id: "landscape",
    title: "Exquisite Landscape",
    description: "Generative AI art piece creating a continuously panning 24-hour landscape synchronized to real time. LangChain + OpenAI generate chained narrative prompts, Stability AI builds seamless panoramas via mask-based inpainting.",
    roles: ["Software Development", "AI/ML"],
    categories: ["AI", "Artwork"],
    image: "/images/exquisite-landscape.png",
    link: "https://landscapeclock.vercel.app",
  },
};
