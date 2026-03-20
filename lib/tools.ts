import Anthropic from "@anthropic-ai/sdk";
import { PROJECTS, type Project } from "./portfolioData";
import { CONTENT_BLOCKS } from "./contentData";

// Tool definitions for Claude
export var toolDefinitions: Anthropic.Tool[] = [
  {
    name: "search_portfolio",
    description:
      "Search Erik's portfolio for projects matching a query. Can filter by category. Returns matching projects with titles, descriptions, and categories.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search terms to match against project titles and descriptions",
        },
        category: {
          type: "string",
          description: "Optional category filter: AI, Interactive, Exhibition/Museum, AR/VR, 3D, Artwork, Mechatronic",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_project_details",
    description:
      "Get full details for a specific project by ID. Returns title, description, roles, categories, and media info.",
    input_schema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID (e.g. 'intuitive', 'foam', 'agentic3d', 'microsoft', 'prague')",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "get_skills",
    description:
      "Get Erik's skills and capabilities. Can filter by category: 'design' for Design & Product skills, 'engineering' for Engineering skills, 'data' for Data & AI skills, or 'all' for everything.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "Category filter: 'design', 'engineering', 'data', or 'all'",
        },
      },
      required: ["category"],
    },
  },
  {
    name: "get_resume",
    description:
      "Get Erik's resume including work history, education, and recognition. Can filter by section: 'experience', 'education', 'recognition', or 'all'.",
    input_schema: {
      type: "object" as const,
      properties: {
        section: {
          type: "string",
          description: "Section filter: 'experience', 'education', 'recognition', or 'all'",
        },
      },
      required: ["section"],
    },
  },
];

// Tool execution functions
export function executeTool(
  name: string,
  input: Record<string, unknown>
): { output: string; projectRefs?: string[]; contentRefs?: string[] } {
  switch (name) {
    case "search_portfolio":
      return searchPortfolio(
        input.query as string,
        input.category as string | undefined
      );
    case "get_project_details":
      return getProjectDetails(input.project_id as string);
    case "get_skills":
      return getSkills(input.category as string);
    case "get_resume":
      return getResume(input.section as string);
    default:
      return { output: `Unknown tool: ${name}` };
  }
}

function searchPortfolio(
  query: string,
  category?: string
): { output: string; projectRefs: string[] } {
  var q = query.toLowerCase();
  var words = q.split(/\s+/).filter((w) => w.length > 2);
  var results: { project: Project; score: number }[] = [];

  for (var project of Object.values(PROJECTS)) {
    var matchesCategory =
      !category || project.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()));

    var searchText = `${project.title} ${project.description} ${project.roles.join(" ")} ${project.categories.join(" ")}`.toLowerCase();

    // Score by how many search words appear in the project text
    var matchCount = words.filter((w) => searchText.includes(w)).length;
    var matchesQuery = matchCount > 0;

    // Broad queries that should return everything
    var isBroadQuery = ["all", "projects", "portfolio", "everything", "list", "show", "recent"].some((w) => q.includes(w));

    if (matchesCategory && (matchesQuery || isBroadQuery)) {
      results.push({ project, score: isBroadQuery ? 1 : matchCount });
    }
  }

  // Sort by relevance score, limit to top 10
  results.sort((a, b) => b.score - a.score);
  var topResults = results.slice(0, 10);

  var projectRefs = topResults.map((r) => r.project.id);
  var output = topResults.length === 0
    ? `No projects found matching "${query}"${category ? ` in category ${category}` : ""}.`
    : topResults
        .map((r) => `${r.project.id}: ${r.project.title} — ${r.project.description.slice(0, 120)}... [${r.project.categories.join(", ")}]`)
        .join("\n\n");

  return {
    output: `Found ${topResults.length} projects:\n\n${output}`,
    projectRefs,
  };
}

function getProjectDetails(
  projectId: string
): { output: string; projectRefs: string[] } {
  var project = PROJECTS[projectId];
  if (!project) {
    return { output: `Project "${projectId}" not found. Available IDs: ${Object.keys(PROJECTS).join(", ")}`, projectRefs: [] };
  }

  return {
    output: `${project.title}\nRoles: ${project.roles.join(", ")}\nCategories: ${project.categories.join(", ")}\n\n${project.description}${project.link ? `\n\nLink: ${project.link}` : ""}`,
    projectRefs: [projectId],
  };
}

function getSkills(
  category: string
): { output: string; contentRefs: string[] } {
  var block = CONTENT_BLOCKS.skills;
  if (!block.tabs) {
    return { output: "Skills data not available.", contentRefs: [] };
  }

  var sections: string[] = [];
  var tabFilter = category.toLowerCase();

  for (var tab of block.tabs) {
    var matchesFilter =
      tabFilter === "all" ||
      tab.label.toLowerCase().includes(tabFilter);

    if (matchesFilter) {
      for (var section of tab.sections) {
        sections.push(`${section.heading}:\n${section.items.map((i) => `  - ${i}`).join("\n")}`);
      }
    }
  }

  var output = sections.length > 0
    ? sections.join("\n\n")
    : `No skills found for category "${category}". Available: design, engineering, data, all.`;

  if (block.closing) {
    output += `\n\n${block.closing}`;
  }

  return { output, contentRefs: ["skills"] };
}

function getResume(
  section: string
): { output: string; contentRefs: string[] } {
  var block = CONTENT_BLOCKS.resume;
  if (!block.tabs) {
    return { output: "Resume data not available.", contentRefs: [] };
  }

  var sections: string[] = [];
  var sectionFilter = section.toLowerCase();

  for (var tab of block.tabs) {
    var matchesFilter =
      sectionFilter === "all" ||
      tab.label.toLowerCase().includes(sectionFilter);

    if (matchesFilter) {
      sections.push(`=== ${tab.label} ===`);
      for (var s of tab.sections) {
        sections.push(`${s.heading}:\n${s.items.map((i) => `  - ${i}`).join("\n")}`);
      }
    }
  }

  var output = sections.length > 0
    ? sections.join("\n\n")
    : `No resume section found for "${section}". Available: experience, education, recognition, all.`;

  return { output, contentRefs: ["resume"] };
}
