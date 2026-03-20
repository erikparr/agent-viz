"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import { ContentBlock } from "./ContentBlock";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/lib/portfolioData";
import { CONTENT_BLOCKS } from "@/lib/contentData";
import type { Project } from "@/lib/portfolioData";
import type { AgentRun } from "@/lib/types";

interface SidePanelProps {
  run: AgentRun;
  onSelectProject: (project: Project) => void;
}

export function SidePanel({ run, onSelectProject }: SidePanelProps) {
  var [activeCategory, setActiveCategory] = useState<string | null>(null);

  var { contentIds, projectIds } = useMemo(() => {
    var seenContent = new Set<string>();
    var seenProject = new Set<string>();
    var cIds: string[] = [];
    var pIds: string[] = [];
    for (var step of run.steps) {
      if (step.contentRefs) {
        for (var ref of step.contentRefs) {
          if (!seenContent.has(ref) && CONTENT_BLOCKS[ref]) {
            seenContent.add(ref);
            cIds.push(ref);
          }
        }
      }
      if (step.projectRefs) {
        for (var ref of step.projectRefs) {
          if (!seenProject.has(ref) && PROJECTS[ref]) {
            seenProject.add(ref);
            pIds.push(ref);
          }
        }
      }
    }
    return { contentIds: cIds, projectIds: pIds };
  }, [run.steps]);

  // Derive categories from visible projects
  var categories = useMemo(() => {
    var cats = new Set<string>();
    for (var id of projectIds) {
      for (var cat of PROJECTS[id].categories) {
        cats.add(cat);
      }
    }
    return Array.from(cats).sort();
  }, [projectIds]);

  // Filter projects by active category
  var filteredProjectIds = useMemo(() => {
    if (!activeCategory) return projectIds;
    return projectIds.filter((id) => PROJECTS[id].categories.includes(activeCategory!));
  }, [projectIds, activeCategory]);

  if (contentIds.length === 0 && projectIds.length === 0) return null;

  return (
    <div className="space-y-6">
      {contentIds.length > 0 && (
        <TerminalChrome title={CONTENT_BLOCKS[contentIds[0]].title}>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-terminal">
            <AnimatePresence>
              {contentIds.map((id) => (
                <ContentBlock key={id} block={CONTENT_BLOCKS[id]} />
              ))}
            </AnimatePresence>
          </div>
        </TerminalChrome>
      )}

      {projectIds.length > 0 && (
        <TerminalChrome title="Projects">
          <div className="space-y-3 max-h-[80vh] overflow-y-auto scrollbar-terminal">
            {/* Category filters */}
            {categories.length > 1 && (
              <div className="flex gap-1 flex-wrap pb-2 border-b border-border-muted">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-[10px] px-2 py-1 border transition-colors focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none ${
                    activeCategory === null
                      ? "border-border-accent text-text-primary bg-bg-elevated"
                      : "border-border-muted text-text-secondary hover:border-border-accent hover:text-text-primary"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`text-[10px] px-2 py-1 border transition-colors focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none ${
                      activeCategory === cat
                        ? "border-border-accent text-text-primary bg-bg-elevated"
                        : "border-border-muted text-text-secondary hover:border-border-accent hover:text-text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {filteredProjectIds.map((id) => (
                <ProjectCard
                  key={id}
                  project={PROJECTS[id]}
                  onClick={() => onSelectProject(PROJECTS[id])}
                />
              ))}
            </AnimatePresence>
          </div>
        </TerminalChrome>
      )}
    </div>
  );
}
