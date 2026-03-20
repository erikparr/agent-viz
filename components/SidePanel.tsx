"use client";

import { useMemo } from "react";
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

  if (contentIds.length === 0 && projectIds.length === 0) return null;

  return (
    <div className="space-y-6">
      {contentIds.length > 0 && (
        <TerminalChrome title={CONTENT_BLOCKS[contentIds[0]].title}>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
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
          <div className="space-y-3 max-h-[80vh] overflow-y-auto">
            <AnimatePresence>
              {projectIds.map((id) => (
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
